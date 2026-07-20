# Finetunio Website

Static marketing site for Finetunio — **AI Optimization Intelligence: the decision layer for model behavior change**.

Built per `projects/workspaces/finetunio-workspace/02-dev-planning/website-kickoff-plan-2026-07-19.md`.

## Stack

- Plain HTML + classic CSS + vanilla JS (ES modules). No framework, no build step, no Tailwind/Bootstrap/utility CSS.
- BEM class naming throughout.
- CSS Grid for page/section macro layout; Flexbox for component internals.
- JS drives the interactive decision demo (hero workbench + plan explorer), scroll reveal, and mobile nav. All motion honors `prefers-reduced-motion`.

## Run

Any static server from this directory, e.g.:

```
python3 -m http.server 4173
```

(ES modules require http://, not file://.)

## Structure

- `index.html` — single high-density homepage (hero demo → problem → category → plan → interventions → intent UX → lifecycle → trust → feedback loop → CTA).
- `css/main.css` — full design system (tokens, sections, components, responsive, reduced-motion).
- `js/engine.js` — static simulation of the documented v0.1 Decision Engine rules (matrix scores, −25 low-risk fine-tune penalty, $6 budget hard gate, dataset-size modifier, whyNotFineTune). **Not** the real engine; kept honest to its documented mechanics.
- `js/demo.js` — hero workbench + Optimization Plan explorer UI.
- `js/main.js` — nav + scroll-reveal behavior.
- `CLAIMS.md` — claim matrix: every product claim on the page mapped to its source doc and status.

## Product-truth stance

Copy distinguishes **built** (Decision Engine, 7-stage lifecycle, files-as-truth) / **simulated today** (run execution) / **coming next** (evaluation intelligence, feedback loop, multi-branch canvas). Do not add claims without updating `CLAIMS.md`.

## Launch TODOs (deliberate placeholders)

- `og:image` points at an SVG; render a 1200×630 PNG before launch (many platforms ignore SVG OG images).
- Canonical URL is a placeholder (`https://finetunio.dev/`) — no domain is registered yet.
- Final CTA destination (waitlist / repo / alpha instructions) pending the release-posture decision in the kickoff plan.
- No analytics wired in (kickoff plan: hooks prepared, nothing invasive).
