# Polish 3 — exhaustive finding map

Candidate repaired: `861274e0eb907cd0b014173be2e863f816877a9e`

Review base: `78cabd32146f0e03b16679272ddaddfe2dd9005e`

Repair commits: `39dffbe4888f53aab97e3557ce4aa9dec5250288`, `f845746745a331620f05e61011f69b4c9191dbf4`

Live URL: <https://data-engine-switchboard.sociobot.in/>

Every finding in reviews 1–3 was rechecked. “Live suite” below means `npm run test:live`, whose artifact is `.factory/evidence/polish-3-live/live-check.json`. It checks desktop and 390 px routes, exact titles, metadata, focus, Back, Axe, overflow, demo isolation, links, headers, and the product-owned HTTP 404.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the literal five-word job headline, named Python data engineers, and retained one primary sample action with its result. | `@claim:demo-sandbox`; live `/`; `.factory/evidence/polish-3-live/home-mobile.png`. |
| F-1-2 | Kept direct `/demo/`, `?demo=1`, the bundled `switchboard demo`, and its self-hosted terminal recording. | `@claim:demo-sandbox`; `@claim:recorded-cli-demo`; live `/demo/`. |
| F-1-3 | Demo code uses only `demo:` storage, never reads the real license sentinel, makes only same-origin requests, resets itself, and clears demo data on Start for real. | `@claim:demo-sandbox`; live suite demo flow. |
| F-1-4 | Expanded `.factory/claims.json` to 11 unique, observable claims with one command each. | All 11 registry commands passed individually in clean clone `/tmp/data-engine-switchboard-polish3-clean-QVqfjs`. |
| F-1-5 | The real bundled report and recording cover value, schema, order, runtime, memory, and streaming evidence. | `@claim:report-evidence`; `@claim:recorded-cli-demo`; live `/demo/`. |
| F-1-6 | Bounds, CLI no-upload behavior, and site request privacy each have sandbox tests. | `@claim:fixture-bound-before-import`; `@claim:cli-local-only`; `@claim:site-no-analytics`. |
| F-1-7 | Volatile measurements appear only in a recording labeled with its environment and variability. | `@claim:recorded-cli-demo`; `.factory/evidence/polish-3-live/demo-mobile.png`. |
| F-1-8 | Removed the unsupported process-isolation promise; retained tested pre-import fixture enforcement and measured/heuristic separation. | `@claim:fixture-bound-before-import`; `@claim:report-evidence`. |
| F-1-9 | Removed binary-embedding marketing and strengthened no-upload verification to record any process-tree socket attempt. | `@claim:cli-local-only`; the attempt marker remains absent. |
| F-1-10 | Removed the unavailable paid tier, price, refund, and entitlement promises. | Live suite link crawl; no checkout or license UI on live `/`. |
| F-1-11 | Removed license/offline marketing; demo isolation is now independent of real storage and Start for real clears demo state. | `@claim:demo-sandbox`; live suite. |
| F-1-12 | README now documents the actual source build, audience, bundled sample, and transformation return contract in short sentences. | `.factory/copy-audit.md`; clean `npm test`; `@claim:recorded-cli-demo`. |
| F-1-13 | Output equality, no prompt, config-relative paths, bounds, and local execution are exercised rather than asserted from source. | `@claim:cli-output-contract`; `@claim:fixture-bound-before-import`; `@claim:cli-local-only`. |
| F-1-14 | Comparison policies and measured-versus-warning structure are verified from generated reports. | `@claim:comparison-policy`; `@claim:report-evidence`. |
| F-1-15 | The bundled sample, build outputs, and package are real and reproducible; unsupported release-download wording stays absent. | `@claim:recorded-cli-demo`; clean `npm run build`; clean `cargo package --locked`. |
| F-1-16 | Production license behavior remains absent; CLI and site privacy are observed dynamically. | `@claim:cli-local-only`; `@claim:site-no-analytics`; live suite. |
| F-1-17 | The dead checkout and paid section remain removed. | Live suite crawled every retained product and GitHub link successfully. |
| F-1-18 | Kept the product-styled 404 and host response override. | Live `/missing-polish-3-route` returned HTTP 404 with one focused H1 and zero Axe violations. |
| F-1-19 | Kept the restrictive same-origin CSP and security headers. | Live suite headers; cold `curl -I /` shows CSP, `nosniff`, referrer policy, permissions policy, and HSTS. |
| F-1-20 | Every route retains canonical, Open Graph, Twitter, favicon, and Apple icon metadata. | `@claim:route-metadata`; live suite on five routes at two viewports. |
| F-1-21 | Every document focuses its H1; Privacy navigation and Back focus the destination H1. | `product routes are focused, complete, responsive, and accessible`; live suite. |
| F-1-22 | Header, four-link navigation, footer, legal links, factory credit, version, and `build polish-3` are shared. | Live suite across `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`. |
| F-1-23 | GitHub destinations visibly say “external”; the privacy contact now links to the real issue tracker. | `legal pages state the tested report and transformation boundaries`; live link crawl. |
| F-1-24 | The tab panel remains a valid `div[role=tabpanel]`. | Axe reports zero violations on all five routes at desktop and 390 px. |
| F-1-25 | Navigation and content links retain at least 44 px targets; all four phone navigation labels fit. | `mobile navigation exposes complete touch targets`; live suite; home screenshot. |
| F-1-26 | Split the README capability copy into short sentences. | `.factory/copy-audit.md`: every README sentence is at most 22 words. |
| F-1-27 | Kept fixture type and 1–512 MB guidance as separate sentences. | `.factory/copy-audit.md`; README fixture section. |
| F-1-28 | Kept the streaming-warning explanation split into origin, review, and decision statements. | `.factory/copy-audit.md`; `@claim:report-evidence`. |
| F-1-29 | The hero names the exact migration job, not the control-room metaphor. | Live `/`; `.factory/evidence/polish-3-live/home-mobile.png`. |
| F-1-30 | Sample copy uses “bundled sample”, “recorded report”, and literal difference names. | Live `/demo/`; `recorded web report shows a real CLI recording`. |
| F-1-31 | Workflow headings remain verb-led and meaningful out of context. | `.factory/copy-audit.md`; live `/`. |
| F-1-32 | Install copy says to build from source and run the local check. | Live `/`; README; `.factory/copy-audit.md`. |
| F-1-33 | The vague Field Kit and all paid-tier copy remain absent. | Live root text and link crawl. |
| F-1-34 | README opens with the CLI job and Python-engineer audience in plain sentences. | README; `.factory/copy-audit.md`. |
| F-1-35 | README headings name the task: bundled sample, install/use, report checks, privacy, and development. | README heading audit. |
| F-1-36 | Visitor copy consistently uses “schema difference” and “streaming warning”. | `site/src/demo.test.ts`; `.factory/copy-audit.md`; live `/demo/`. |
| F-2-1 | Kept the self-hosted SVG capture tied to a real `switchboard demo` execution and its decision/findings/warning. | `@claim:recorded-cli-demo`; live `/demo/`; demo screenshot. |
| F-2-2 | Claims now cover output, policies, evidence, report scope, bounds, network behavior, transformation access, demo isolation, site requests, and metadata. | All 11 clean-clone claim commands; strengthened socket-attempt marker. |
| F-2-3 | Legal and 404 routes retain complete route-specific social metadata. | `@claim:route-metadata`; live suite. |
| F-2-4 | The phone header uses a four-column rail with complete labels and targets at least 44 px high. | `mobile navigation exposes complete touch targets`; live 390 px checks. |
| F-2-5 | “Schema” is the sole visitor-facing term for the dtype/column comparison. | `site/src/demo.test.ts`; live demo and README audit. |
| F-3-1 | Replaced the false provenance promise with the report’s exact scope and omissions. Added a report-shape claim that inspects every nested key. | `@claim:report-scope`; `legal pages state the tested report and transformation boundaries`; live `/terms/`; `.factory/evidence/polish-3-live/terms-mobile.png`. |
| F-3-2 | Privacy now says supplied Python code can access files available to its process, while Switchboard itself sends nothing. Added a transformation that reads an undeclared sentinel. | `@claim:transformation-file-access`; strengthened `@claim:cli-local-only`; live `/privacy/`; `.factory/evidence/polish-3-live/privacy-mobile.png`. |

## Verification summary

- Clean clone: `/tmp/data-engine-switchboard-polish3-clean-QVqfjs` at `39dffbe4888f53aab97e3557ce4aa9dec5250288`.
- Every one of the 11 `.factory/claims.json` commands: pass.
- `npm test`: pass — 8 Rust tests, 1 Vitest test, all CLI claims, and 16 Playwright runs.
- `npm run build`: pass — `dist/bin/switchboard` and `dist/site/`.
- `cargo package --manifest-path crates/switchboard/Cargo.toml --locked`: pass — 18 files, 17.5 KiB compressed.
- `npm audit --audit-level=high`: pass — zero vulnerabilities.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.3 s, CLS 0, TBT 0 ms. Evidence: `.factory/evidence/polish-3-local/lighthouse.json`.
- Deployment: Azure Static Web Apps deployment `ad45b9b7-3294-42a3-a701-c1be14085d2d` succeeded.
- Worker verification: `.factory/evidence/polish-3-live-root/verify.json` reports HTTP 200, 807 ms, no console errors, one H1/main, `lang=en`, complete alt text, and named buttons.
- Cold live suite: 10 route/viewport combinations, zero Axe violations, only same-origin runtime requests, working focus/Back, isolated demo reset/exit, complete metadata, valid links, and designed HTTP 404.
- Deployed root, Privacy, and Terms HTML are byte-identical to `dist/site/`; hashes are recorded in the handoff.

No finding remains open.
