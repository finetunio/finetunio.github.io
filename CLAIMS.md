# Claim Matrix — Finetunio Website

Every product claim on the homepage, its status, and its source. Statuses: **built** (safe to state as fact), **in-progress** (must be labeled roadmap/next), **future** (vision only), **avoid** (never claim).

Sources: `01-reference/06-as-built-state.md` (AB), `02-dev-planning/v1-readiness-assessment-2026-07-18.md` (VR), `02-dev-planning/website-kickoff-plan-2026-07-19.md` (KP).

| Claim on site | Status | Source | Notes |
|---|---|---|---|
| Ranked, composed, justified plans across 5 interventions | built | AB, VR §2.1–2 | Engine output: ≤4 steps, fitScore, rationale, actions |
| whyNotFineTune reasoning | built | AB, VR §2.3 | Core differentiator |
| Rules-based matrix scoring, no LLM in critical path | built | AB | ADR-002 |
| 122/122 Decision Engine tests | built | AB, VR §2.1 | |
| −25 fine-tune penalty at low risk; $6 budget hard gate; dataset-size modifier | built | AB | Mirrored in demo `js/engine.js` |
| Intent-first inputs (goal, risk, budget, time) | built | AB (Intent ✅), VR §2.4 | |
| Seven-stage lifecycle you can walk end-to-end | built | VR §3 | "with simulation in the middle" — page says so |
| Files as source of truth; SQLite rebuildable index; atomic writes; archive-never-delete | built | AB | |
| Headless Fastify 5 core; Vue 3 client as one consumer | built | AB | |
| Run execution | **simulated** | AB (Runs 🔶), VR §3 | Labeled "Simulated today" on lifecycle rail |
| Evaluation intelligence / automated metrics | in-progress | VR §3, roadmap Phase 1 | Labeled "Coming next" |
| Feedback loop (evaluate → diagnose → revise) | in-progress/future | VR §2.6 | Section explicitly labeled roadmap, status line "in progress" |
| Multi-branch workflow canvas | in-progress | VR §3 | Rail labels Workflow "Built · linear" |
| Hosted platform / production training automation | **avoid** | KP boundaries | Never stated; CTA says "local alpha", "invite-only" |
| Specific customers, benchmarks, or performance numbers | **avoid** | KP boundaries | None on page |
| Demo = real engine | **avoid** | KP §4 | Demo badge reads "static simulation of real engine rules"; disclaimer under plan section |

## Rules for future edits

1. New claim → new row here first.
2. Anything not ✅ in `06-as-built-state.md` must carry a visible status label on the page.
3. The demo may only encode mechanics documented in the as-built doc.
