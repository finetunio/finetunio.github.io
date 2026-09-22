# TODO — finetunio-website

> Source of truth for this app's backlog. Mirror one-liners in the sandbox root `TODO.md` (By project).
> Built 2026-07-19 per `finetunio-workspace/02-dev-planning/website-kickoff-plan-2026-07-19.md`.

## Launch blockers (Week 4 scope)

- [ ] **Decide release posture + final CTA destination.** Current copy assumes private/local alpha ("invite-only"); "Join the local alpha" CTA was intentionally left off until there is a real destination (waitlist form, repo link, or alpha instructions). Kickoff plan "Content Decisions Needed" #1 and #4.
- [ ] **OG image as PNG.** `assets/og.svg` exists and is referenced, but most platforms (Slack, X, LinkedIn) ignore SVG `og:image`. Render a 1200×630 PNG from it and switch the meta tag.
- [x] **Canonical URL / domain.** Done 2026-09-22 — `canonical` + `og:url` now `https://finetunio.com/`, `og:image` made absolute. Site is **live** at `https://finetunio.com/`, served by GitHub Pages from `finetunio/finetunio.github.io` (org user site, `main` branch root, `CNAME` + `.nojekyll` in repo). DNS at DNSimple: apex → 4 GitHub A records, `www` → CNAME `finetunio.github.io`, Enforce HTTPS on. Deploys = `git push` to `main`.
- [ ] **Lighthouse pass** against kickoff targets (Perf ≥ 90, A11y ≥ 95, SEO ≥ 90) in real Chrome; site is static and font-light so risk is low, but it has not been formally measured.
- [ ] **Cross-browser QA** (Safari/Firefox; `backdrop-filter` already removed from the sticky header).

## Polish backlog (post-launch OK)

- [ ] Real app screenshots or stylized panels for the lifecycle rail stages (currently text-only cards; kickoff plan Week 4 "proof assets" decision #3).
- [ ] Structured data (JSON-LD `SoftwareApplication`) for SEO.
- [ ] Consider a `/thesis` page — "Read the product thesis" currently anchors to the category section.
- [ ] Analytics hooks (kickoff: prepared, not invasive) — nothing wired yet by design.
- [ ] Optional: call the real Decision Engine API from the demo once the core API boot issue in `apps/finetunio` is fixed (demo is engine-rule-faithful static simulation until then).

## Done (2026-07-19 kickoff build)

- [x] Scaffolded static site (no framework, no build step) with classic CSS + BEM, Grid macro layouts, Flexbox internals.
- [x] Full homepage per storyboard: hero + interactive workbench, problem, category stack, Optimization Plan explorer, five interventions, intent-first translation, 7-stage lifecycle rail with honest built/simulated/next labels, trust (light) section, feedback loop, final CTA.
- [x] Interactive decision demo mirroring documented engine rules (matrix scores, −25 low-risk FT penalty, $6 budget hard gate, dataset modifier, whyNotFineTune flip).
- [x] SEO/social metadata, favicon, OG SVG.
- [x] Reduced-motion + fail-open reveal behavior (content never withheld when animations can't run).
- [x] `CLAIMS.md` claim matrix (every claim → source doc → built/in-progress/future/avoid).
- [x] Verified: desktop + 375px mobile full-page renders, demo interactions (budget gate, goal switching), no console errors, no horizontal overflow.
