# HANDOFF

<!-- agent-handoff v1; updated: 2026-10-29; by: Claude Code -->

Repository: `finetunio-website` (static marketing site for Finetunio; GitHub remote
`finetunio/finetunio.github.io`, live at finetunio.com since 2026-09-22). Status: READY; launch polish
remains (`TODO.md`).
Baseline: `main` at `0135b64` (2026-10-04), clean and in step with upstream when observed 2026-10-29.
First `HANDOFF.md` for this repo (2026-10-29, app baseline D-022).

## Current State

- Plain HTML, classic BEM CSS and vanilla JS modules; no build step. The interactive decision demo
  mirrors documented engine rules (`README.md`, `TODO.md`).
- Built per `projects/workspaces/finetunio-workspace/02-dev-planning/website-kickoff-plan-2026-07-19.md`;
  claims are tracked in `CLAIMS.md`.

## Next Actions

1. Owner decision: release posture and the final call-to-action destination (copy assumes a private
   local alpha).
2. Then the PNG OG image, Lighthouse pass and cross-browser QA listed in `TODO.md`.

## Landmines

- Deploys are a `git push` to `main` (GitHub Pages): anything pushed is public.
- Keep product claims aligned with the app's real state (`projects/apps/finetunio/HANDOFF.md`) and
  `CLAIMS.md`.

## Verification

Nothing was run for this handoff (observed from git, `README.md` and `TODO.md` on 2026-10-29). Preview
locally with `python3 -m http.server 4173` (ES modules need http://).
