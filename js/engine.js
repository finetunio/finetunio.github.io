/*
 * Finetunio website — static decision-demo simulation.
 *
 * This is NOT the real Decision Engine. It is a small, honest replica of the
 * documented v0.1 scoring mechanics (rules-based matrix scoring, risk penalty,
 * budget hard gate, dataset-size modifier, whyNotFineTune reasoning) so the
 * marketing demo behaves like real engine output without a backend.
 * Sources: finetunio-workspace/01-reference/06-as-built-state.md,
 *          finetunio-workspace/02-dev-planning/v1-readiness-assessment-2026-07-18.md
 */

const INTERVENTIONS = {
  prompt: {
    label: 'Prompt optimization',
    kind: 'prompt',
    cost: [0, 5],
    hours: 2,
    actions: ['Rewrite system prompt against failure set', 'Add counter-examples for observed errors', 'A/B the revised prompt on held-out cases'],
  },
  rag: {
    label: 'Retrieval / RAG',
    kind: 'rag',
    cost: [5, 15],
    hours: 6,
    actions: ['Index the authoritative corpus', 'Ground answers with retrieved citations', 'Measure unsupported-claim rate before/after'],
  },
  finetune: {
    label: 'Fine-tuning (QLoRA)',
    kind: 'finetune',
    cost: [6, 40],
    hours: 8,
    actions: ['Curate and validate the example set', 'Run a small QLoRA pass at conservative settings', 'Compare against the un-tuned baseline'],
  },
  tools: {
    label: 'Tool use / MCP skills',
    kind: 'tools',
    cost: [0, 10],
    hours: 5,
    actions: ['Expose the task as callable tools', 'Constrain the model to tool-mediated answers', 'Log tool-call success rate'],
  },
  guardrails: {
    label: 'Guardrails / post-processing',
    kind: 'guardrails',
    cost: [0, 5],
    hours: 3,
    actions: ['Define output schema and validators', 'Reject-and-retry on validation failure', 'Track violation rate over time'],
  },
};

const GOALS = {
  hallucinations: {
    label: 'Reduce hallucinations',
    problemClass: 'Knowledge grounding failure',
    confidence: 0.86,
    diagnosis: 'The model asserts facts it has no grounded source for. This is a knowledge problem, not a weights problem — new parameters do not create missing facts.',
    base: { rag: 88, prompt: 76, guardrails: 62, finetune: 48, tools: 40 },
  },
  tone: {
    label: 'Adopt a consistent voice & style',
    problemClass: 'Behavioral consistency gap',
    confidence: 0.81,
    diagnosis: 'The desired change is stylistic and repeatable across inputs — the strongest case for baking behavior into weights, if the example set is large and clean enough.',
    base: { finetune: 86, prompt: 78, guardrails: 55, rag: 20, tools: 15 },
  },
  domain: {
    label: 'Answer from private domain knowledge',
    problemClass: 'Missing-context problem',
    confidence: 0.88,
    diagnosis: 'The model lacks access to your corpus. Retrieval injects it at answer time and stays current as documents change; weights would freeze a snapshot.',
    base: { rag: 90, tools: 60, prompt: 58, finetune: 52, guardrails: 30 },
  },
  format: {
    label: 'Enforce strict output format',
    problemClass: 'Output-contract violation',
    confidence: 0.84,
    diagnosis: 'Failures are structural, not semantic. Deterministic validation catches 100% of violations; training only lowers their probability.',
    base: { guardrails: 84, prompt: 80, finetune: 60, tools: 45, rag: 15 },
  },
  instructions: {
    label: 'Follow multi-step instructions reliably',
    problemClass: 'Task-decomposition failure',
    confidence: 0.79,
    diagnosis: 'The model loses state across steps. Externalizing steps as tool calls makes each one checkable instead of hoping weights internalize the procedure.',
    base: { tools: 88, prompt: 74, guardrails: 58, finetune: 50, rag: 30 },
  },
  safety: {
    label: 'Stay inside policy boundaries',
    problemClass: 'Boundary-enforcement gap',
    confidence: 0.83,
    diagnosis: 'Policy compliance needs a hard floor, not a statistical tendency. Enforcement layers guarantee it; tuned weights only encourage it.',
    base: { guardrails: 90, prompt: 70, finetune: 45, rag: 25, tools: 35 },
  },
};

const PLAN_THRESHOLD = 35;
const MAX_STEPS = 4;

/* Mirrors the documented v0.1 modifiers: −25 fine-tuning at low risk,
 * budget hard gate (fine-tuning = 0 below $6), dataset-size modifier. */
export function computePlan({ goal, datasetSize, risk, budget }) {
  const g = GOALS[goal];
  const notes = [];
  const scores = {};

  for (const [key, base] of Object.entries(g.base)) {
    let score = base;
    if (key === 'finetune') {
      if (budget < 6) {
        score = 0;
        notes.push({ tone: 'gate', text: `Budget $${budget} is under the $6 hard gate — fine-tuning is excluded outright.` });
      } else {
        if (risk === 'low') {
          score -= 25;
          notes.push({ tone: 'penalty', text: 'Low risk tolerance applies a −25 penalty: weight changes are the hardest intervention to roll back.' });
        }
        if (datasetSize < 500) {
          score -= 20;
          notes.push({ tone: 'penalty', text: `${datasetSize} examples is below a reliable tuning threshold (−20): expect memorization, not generalization.` });
        } else if (datasetSize > 5000) {
          score += 10;
          notes.push({ tone: 'boost', text: `${datasetSize.toLocaleString()} examples is a strong training set (+10).` });
        }
      }
    }
    scores[key] = Math.max(0, Math.min(100, score));
  }

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key, fitScore], i) => ({
      ...INTERVENTIONS[key],
      key,
      fitScore,
      priority: i + 1,
      gated: fitScore === 0 && key === 'finetune' && budget < 6,
    }));

  const steps = ranked.filter((s) => s.fitScore >= PLAN_THRESHOLD).slice(0, MAX_STEPS);
  const ftRank = ranked.findIndex((s) => s.key === 'finetune') + 1;

  let whyNotFineTune;
  if (ftRank === 1) {
    whyNotFineTune = {
      title: 'Why fine-tuning IS right here',
      body: `A consistent behavioral change, ${datasetSize.toLocaleString()} examples, and ${risk} risk tolerance is the profile where weight changes beat prompting. The engine recommends it when the evidence supports it — and talks you out of it when it doesn't.`,
    };
  } else {
    const reasons = notes.length
      ? notes.map((n) => n.text)
      : [`For ${g.problemClass.toLowerCase()}s, ${INTERVENTIONS[steps[0].key].label.toLowerCase()} changes behavior faster, cheaper, and reversibly. Fine-tuning stays ranked #${ftRank} as an escalation, not a starting point.`];
    whyNotFineTune = { title: 'Why not fine-tune first?', body: reasons.join(' ') };
  }

  const costLow = steps.reduce((s, x) => s + x.cost[0], 0);
  const costHigh = steps.reduce((s, x) => s + x.cost[1], 0);
  const hours = steps.reduce((s, x) => s + x.hours, 0);

  return {
    goal: g,
    diagnosis: { primaryClass: g.problemClass, confidence: g.confidence, reasoning: g.diagnosis },
    ranked,
    steps,
    notes,
    whyNotFineTune,
    estimate: { costLow, costHigh, hours },
  };
}

export { GOALS, INTERVENTIONS };
