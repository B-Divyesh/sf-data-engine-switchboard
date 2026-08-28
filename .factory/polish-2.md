# Polish 2 — complete finding map

Candidate repaired from `a49c54d1ed291b1e237e656d2e84ec9037c103cb`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the plain five-word job headline, named Python data engineers, and retained the single sample-data action with its result. | `tests/e2e/site.spec.ts` first-screen checks; live `/` cold check. |
| F-1-2, F-1-7, F-2-1 | Added `site/public/switchboard-demo-recording.svg`: a self-hosted terminal capture of `switchboard demo`, with decision, findings, runtime, peak RSS, and plan-warning evidence. The demo page labels its recorded environment and variable measurements. | `@claim:recorded-cli-demo`; `recorded web report shows a real CLI recording`; live `/demo/`. |
| F-1-3 | Preserved isolated `/demo/` and `?demo=1` redirect behavior, the persistent banner, Reset demo, and Start for real. | `@claim:demo-sandbox`; live `/?demo=1`. |
| F-1-4 to F-1-6, F-1-8 to F-1-16, F-2-2 | Expanded `.factory/claims.json` to nine public contracts. Replaced static/source-only coverage with fresh-temp CLI observations, output-file equality, policy reporting, whole-route request capture, and a process-tree network-denial guard. | All nine registered commands; `npm run test:claims`; clean-clone evidence in handoff. |
| F-1-9 | Tested no-upload behavior by running the CLI demo with AF_INET/AF_INET6 sockets denied in every child process and asserting local report output. | `@claim:cli-local-only`. |
| F-1-10, F-1-11, F-1-17 | The unavailable paid checkout, license handling, and payment promises remain absent. | `@claim:site-no-analytics` request capture and route/link browser suite. |
| F-1-18, F-1-19 | Kept the designed 404 and deployed CSP configuration. | Browser route suite; live `/missing-review-route` and response-header check. |
| F-1-20, F-2-3 | Added complete Twitter title, description, and image metadata to Privacy and Terms; added complete OG/Twitter metadata to the 404. | `@claim:route-metadata`; live `/privacy/`, `/terms/`, `/404.html`. |
| F-1-21, F-1-22, F-1-23, F-1-24 | Preserved route-H1 focus, shared chrome, marked external guide, and valid tabpanel semantics. | Browser route/a11y suite; live route checks. |
| F-1-25, F-2-4 | Reflowed the phone header into a full-width four-item navigation rail. Every complete label is visible and at least 48px high at 390px. | `mobile navigation exposes complete touch targets`; mobile screenshot path recorded in handoff. |
| F-1-26 to F-1-35 | Kept prior plain-language rewrites and updated sample wording to describe the recorded command rather than a hand-written report. | `.factory/copy-audit.md`; cold live `/` and `/demo/` checks. |
| F-1-36, F-2-5 | Replaced the remaining visitor-facing “type” language with “schema” across landing, demo, README, tabs, and report labels. | `site/src/demo.test.ts`; `rg` audit; live `/demo/`. |

No claim-like landing or README sentence is left outside the registry. The retained “recorded” statements are backed by the real bundled command test and its checked-in SVG artifact.

Screenshot evidence for the UI findings is `.factory/evidence/polish-2-home-mobile.png`, `.factory/evidence/polish-2-demo-mobile.png`, and `.factory/evidence/polish-2-demo-desktop.png`. Live URLs checked after deployment were `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and `/missing-review-route`; the CLI-only rows use their named clean-sandbox test rather than a browser screenshot.
