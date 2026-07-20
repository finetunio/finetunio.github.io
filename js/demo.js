/* Finetunio website — decision-demo orchestration.
 * Hero workbench + Optimization Plan explorer, both driven by engine.js. */

import { computePlan, GOALS } from './engine.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Animate only when the page can actually paint frames; otherwise render the
 * final state immediately so content is never withheld (hidden tab, prerender). */
function canAnimate() {
  return !prefersReducedMotion.matches && document.visibilityState === 'visible';
}

/* ---------------------------------------------------------------- hero */

const heroForm = document.getElementById('hero-form');
const heroRanking = document.getElementById('hero-ranking');
const heroClass = document.getElementById('hero-class');
const heroConf = document.getElementById('hero-conf');
const heroWhynotTitle = document.getElementById('hero-whynot-title');
const heroWhynotBody = document.getElementById('hero-whynot-body');
const datasetOut = document.getElementById('hero-dataset-out');
const budgetOut = document.getElementById('hero-budget-out');

function readHeroInputs() {
  const data = new FormData(heroForm);
  return {
    goal: data.get('goal'),
    datasetSize: Number(data.get('dataset')),
    budget: Number(data.get('budget')),
    risk: data.get('risk'),
  };
}

function renderHero({ animate = true } = {}) {
  const inputs = readHeroInputs();
  datasetOut.textContent = inputs.datasetSize.toLocaleString();
  budgetOut.textContent = `$${inputs.budget}`;

  const plan = computePlan(inputs);
  heroClass.textContent = plan.diagnosis.primaryClass;
  heroConf.textContent = `confidence ${plan.diagnosis.confidence.toFixed(2)}`;
  heroWhynotTitle.textContent = plan.whyNotFineTune.title;
  heroWhynotBody.textContent = plan.whyNotFineTune.body;

  heroRanking.innerHTML = '';
  plan.ranked.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'ranking__item';
    if (i === 0) li.classList.add('ranking__item--top');
    if (item.gated) li.classList.add('ranking__item--gated');
    li.innerHTML = `
      <span class="ranking__rank">${item.priority}</span>
      <span class="ranking__name">${item.label}</span>
      <span class="ranking__track"><span class="ranking__bar"></span></span>
      <span class="ranking__score">${item.gated ? '—' : item.fitScore}</span>
    `;
    heroRanking.appendChild(li);
    const bar = li.querySelector('.ranking__bar');
    const width = `${item.fitScore}%`;
    if (animate && canAnimate()) {
      // Stagger bar fills so ranking reads as the engine "scoring" candidates.
      setTimeout(() => { bar.style.width = width; }, 60 + i * 90);
    } else {
      bar.style.transition = 'none';
      bar.style.width = width;
    }
  });
}

if (heroForm) {
  heroForm.addEventListener('input', () => renderHero({ animate: false }));
  heroForm.addEventListener('change', () => renderHero({ animate: true }));
  renderHero({ animate: true });
}

/* ------------------------------------------------- plan explorer */

const goalHost = document.getElementById('plan-goals');
const planClass = document.getElementById('plan-class');
const planReasoning = document.getElementById('plan-reasoning');
const planConf = document.getElementById('plan-conf');
const planCost = document.getElementById('plan-cost');
const planTime = document.getElementById('plan-time');
const planSteps = document.getElementById('plan-steps');
const planWhynotTitle = document.getElementById('plan-whynot-title');
const planWhynotBody = document.getElementById('plan-whynot-body');

/* Representative intent profiles per goal, drawn from the demo scenarios
 * in the kickoff plan (e.g. hallucinations / 2k examples / medium / $20). */
const PLAN_SCENARIOS = {
  hallucinations: { datasetSize: 2000, risk: 'medium', budget: 20 },
  tone: { datasetSize: 8000, risk: 'high', budget: 40 },
  domain: { datasetSize: 500, risk: 'low', budget: 15 },
  format: { datasetSize: 300, risk: 'low', budget: 5 },
  instructions: { datasetSize: 1200, risk: 'medium', budget: 10 },
  safety: { datasetSize: 900, risk: 'low', budget: 12 },
};

let activeGoal = 'hallucinations';

function renderPlan(goalKey) {
  const scenario = PLAN_SCENARIOS[goalKey];
  const plan = computePlan({ goal: goalKey, ...scenario });

  planClass.textContent = plan.diagnosis.primaryClass;
  planReasoning.textContent = plan.diagnosis.reasoning;
  planConf.textContent = plan.diagnosis.confidence.toFixed(2);
  planCost.textContent = plan.estimate.costLow === plan.estimate.costHigh
    ? `$${plan.estimate.costLow}`
    : `$${plan.estimate.costLow}–$${plan.estimate.costHigh}`;
  planTime.textContent = `~${plan.estimate.hours}h`;
  planWhynotTitle.textContent = plan.whyNotFineTune.title;
  planWhynotBody.textContent = plan.whyNotFineTune.body;

  planSteps.innerHTML = '';
  plan.steps.forEach((step, i) => {
    const li = document.createElement('li');
    li.className = 'plan__step';
    if (i === 0) li.classList.add('plan__step--top');
    li.innerHTML = `
      <span class="plan__step-rank">${step.priority}</span>
      <div class="plan__step-main">
        <span class="plan__step-name">${step.label}</span>
        <span class="plan__step-est">$${step.cost[0]}–$${step.cost[1]} · ~${step.hours}h</span>
      </div>
      <div class="plan__step-detail">
        <p class="plan__step-rationale">${rationaleFor(goalKey, step, i)}</p>
        <div class="plan__step-actions">
          ${step.actions.map((a) => `<span class="plan__step-action">${a}</span>`).join('')}
        </div>
      </div>
      <div class="plan__step-score">
        <span class="plan__step-score-num">${step.fitScore}</span>
        <span class="plan__step-score-label">fit score</span>
      </div>
    `;
    planSteps.appendChild(li);
    if (canAnimate()) {
      li.style.opacity = '0';
      li.style.transform = 'translateY(14px)';
      setTimeout(() => {
        li.style.opacity = '1';
        li.style.transform = 'none';
      }, 60 + i * 110);
    }
  });
}

function rationaleFor(goalKey, step, index) {
  const g = GOALS[goalKey];
  if (index === 0) {
    return `Best fit for a ${g.problemClass.toLowerCase()}: highest behavior change per dollar, fully reversible.`;
  }
  if (step.key === 'finetune') {
    return 'Escalation path once cheaper interventions plateau — run small, compare against baseline.';
  }
  return 'Compounds with the step above; low cost, independently measurable.';
}

function buildGoalSwitcher() {
  Object.entries(GOALS).forEach(([key, g]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'plan__goal';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(key === activeGoal));
    if (key === activeGoal) btn.classList.add('plan__goal--active');
    btn.textContent = g.label;
    btn.addEventListener('click', () => {
      if (key === activeGoal) return;
      activeGoal = key;
      goalHost.querySelectorAll('.plan__goal').forEach((b) => {
        b.classList.toggle('plan__goal--active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      renderPlan(key);
    });
    goalHost.appendChild(btn);
  });
}

if (goalHost) {
  buildGoalSwitcher();
  renderPlan(activeGoal);
}
