# Polish 1 — finding map

Candidate repaired from `af81ae87e6baa63bef8e963c905953d9a7aff46f`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the first screen with the specified job headline, Python audience, and one sample action. | `tests/e2e/site.spec.ts` route test; `/` screenshot after deploy. |
| F-1-2 | Added `/demo/`, `?demo=1`, and `switchboard demo`, which writes a bundled sample to a unique temp directory. | `@claim:demo-sandbox`; `@claim:cli-demo-report`. |
| F-1-3 | Demo is isolated to `demo:` storage, has banner/reset/real-start controls, and has no license or API code. | `@claim:demo-sandbox`. |
| F-1-4 | Added registry and six tagged, runnable claim tests. | `.factory/claims.json`; all commands recorded in handoff. |
| F-1-5 | Bundled CLI test asserts value/schema/order output; demo shows the same three categories. | `@claim:cli-demo-report`; `@claim:sample-report`. |
| F-1-6 | Added full page same-origin capture and oversized-fixture test. | `@claim:site-no-analytics`; `@claim:fixture-bound-before-import`. |
| F-1-7 | Removed volatile measured numbers and labels the screen as a bundled sample report. | `@claim:sample-report`. |
| F-1-8 | Removed untested process claim; retained and tested the pre-import fixture bound. | `@claim:fixture-bound-before-import`. |
| F-1-9 | Removed untested binary wording; privacy claim is covered by embedded-bridge audit. | `@claim:cli-local-no-telemetry`. |
| F-1-10 | Removed the unavailable paid offer, checkout, license handling, and all purchase claims. | Link crawl in browser suite. |
| F-1-11 | Removed license/offline assertions and all production license storage/API behavior. | `@claim:demo-sandbox`; `@claim:site-no-analytics`. |
| F-1-12 | Rewrote README installation and capability copy around source build and bundled demo. | `@claim:cli-demo-report`. |
| F-1-13 | Reduced README behavior claims; retained the bounded-input guarantee with a claim test. | `@claim:fixture-bound-before-import`. |
| F-1-14 | Rewrote comparison copy in plain language and defines the streaming warning once. | Browser route/a11y test. |
| F-1-15 | Removed untested build/package promises and added a real bundled demo proof. | `npm run build`; `@claim:cli-demo-report`. |
| F-1-16 | Removed website license flow; local/no-telemetry statement has a claim test. | `@claim:cli-local-no-telemetry`. |
| F-1-17 | Removed the dead paid checkout and its section. | Browser link crawl in route suite. |
| F-1-18 | Added product-styled `404.html` and Static Web Apps 404 response override. | `/404.html` browser route test; live check after deployment. |
| F-1-19 | Added restrictive CSP in `staticwebapp.config.json`. | deployed response-header check. |
| F-1-20 | Added canonical, OG, Twitter, favicon, original derived 1200×630 image, and 180px Apple icon. | Browser route metadata assertions. |
| F-1-21 | Each document focuses and announces its H1 at load. | Browser route focus assertions. |
| F-1-22 | Reused the same header/footer navigation and factory/build line on all documents. | Browser route suite. |
| F-1-23 | The GitHub destination is visibly marked `(external)`; dead external payment links are removed. | Browser link crawl. |
| F-1-24 | Replaced invalid `article[role=tabpanel]` with `div[role=tabpanel]`. | Axe assertion has zero violations. |
| F-1-25 | Added 44px minimum interactive sizing for footer and content links. | Mobile browser/a11y suite. |
| F-1-26 | Split README capability description into short sentences. | `.factory/copy-audit.md`. |
| F-1-27 | Split fixture type and size instructions. | `.factory/copy-audit.md`. |
| F-1-28 | Split warning explanation into short sentences. | `.factory/copy-audit.md`. |
| F-1-29 | Replaced control-room metaphor in hero copy with the job. | `/` first-screen check. |
| F-1-30 | Replaced seeded/circuit/proof wording with bundled sample/differences. | `/` first-screen check. |
| F-1-31 | Replaced abstract workflow headings with action headings. | `/` heading outline check. |
| F-1-32 | Replaced install metaphors with source-build and local-check wording. | `/` copy audit. |
| F-1-33 | Removed the vague paid tier completely. | `/` link crawl. |
| F-1-34 | Rewrote README opening for Python engineers in plain language. | `.factory/copy-audit.md`. |
| F-1-35 | Replaced unclear README headings. | `.factory/copy-audit.md`. |
| F-1-36 | Uses “streaming warning” consistently. | `.factory/copy-audit.md`. |
