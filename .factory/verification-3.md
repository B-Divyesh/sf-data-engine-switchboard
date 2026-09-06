# Check a Pandas-to-Polars migration — verification 3

Verified 6 September 2026 against <https://data-engine-switchboard.sociobot.in/>.

- Implementation candidate: `0cbee8280a007d0c0080b17d014dc39e03280bec` (`chore: label repair build`).
- Documentation candidate: `f2447751b335eb49dc1d7a358fa07ef145b93624` (`docs: record repair one verification`).
- The documentation commit changes only evidence and handoff material after the implementation candidate. The clean local build and live root have the same SHA-256: `3d658c2af5438930555150bf5ab3fb570ea243882e8dcb08ff5aa0067622819d`.

## Verdict: PASS

**PASS — 0 findings and 0 untested public claims.** The shipped local CLI performs the brief's job: it compares declared Pandas and Polars transformations on bounded local fixtures, records value/schema/order results plus timing and peak-memory evidence, keeps streaming-plan warnings separate from measured results, and produces a GO or NO-GO decision. The seeded demo finds all three intended incompatibilities in one command.

## First screen before scrolling

Fresh 1440×900 desktop and 390×844 phone browser contexts opened `/` at scroll position zero. Both showed:

| Check | Observed text |
| --- | --- |
| Job | “Check a Pandas-to-Polars migration” |
| Audience | “For Python data engineers: compare both transforms on one redacted fixture and get a go/no-go report.” |
| First action | “Try it with sample data” with “A ready sample report opens.” |

The first action was fully inside the phone viewport. Both first screens also showed the three facts: runs on your machine, fixture limit required, and no telemetry.

## Demo, user paths, and browser checks

- The one-click action and `?demo=1` opened `/demo/`. The persistent “Demo — sample data, nothing is saved” label, Reset demo, and Start for real controls were visible.
- The populated sample reported NO-GO with the three intended measured differences: value/tax rounding, schema/identifier, and row order/sort direction. It separately labels time, peak memory, and the streaming warning.
- In a fresh phone context with `real:qa-sentinel=untouched`, demo added only `demo:data-engine-switchboard:opened`. Reset replaced only that demo marker. Start for real removed all `demo:` keys, preserved the real sentinel, and returned to the exact bare root URL.
- Fresh phone and desktop checks found HTTP 200, the expected root title, one H1, one main landmark, no horizontal overflow, no console/page errors, no third-party request, and zero Axe violations. The full local Playwright suite also passed keyboard tab-list operation, route-heading focus, mobile targets, and reduced-motion behavior.
- `/privacy/`, `/terms/`, `/demo/`, and `/404.html` had their expected route titles and metadata. An unknown route returned the designed product recovery page with deliberate HTTP 404; this is expected, not a defect. `robots.txt`, `sitemap.xml`, and every discovered internal/external product link returned 200.
- Live response headers include CSP, `X-Content-Type-Options`, and `Referrer-Policy`. No offline or update behavior is promised, so no offline/update claim applies. This static CLI product has no backend, tenant, persistence, health, or rate-limit surface.

## Claims from a clean checkout

Clean checkout: `/tmp/des-verify3-clean` at `f2447751b335eb49dc1d7a358fa07ef145b93624`. `npm ci` passed with zero audit vulnerabilities. Documented Python prerequisites were installed before running CLI checks.

| Claim | Declared command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npx playwright test --grep @claim:demo-sandbox` | PASS (desktop and mobile) |
| `recorded-cli-demo` | `npm run test:claim -- recorded-cli-demo` | PASS |
| `report-evidence` | `npm run test:claim -- report-evidence` | PASS |
| `report-scope` | `npm run test:claim -- report-scope` | PASS |
| `cli-output-contract` | `npm run test:claim -- cli-output-contract` | PASS |
| `comparison-policy` | `npm run test:claim -- comparison-policy` | PASS |
| `sample-count-bounds` | `npm run test:claim -- sample-count-bounds` | PASS — accepts 1 and 10, rejects 0 and 11 |
| `fixture-bound-before-import` | `npm run test:claim -- fixture-bound-before-import` | PASS |
| `cli-local-only` | `npm run test:claim -- cli-local-only` | PASS |
| `transformation-file-access` | `npm run test:claim -- transformation-file-access` | PASS |
| `site-no-analytics` | `npx playwright test --grep @claim:site-no-analytics` | PASS (desktop and mobile) |
| `route-metadata` | `npx playwright test --grep @claim:route-metadata` | PASS (desktop and mobile) |

No claim-like landing, README, demo, Privacy, or Terms statement lacks coverage by the current claim registry and sandbox checks.

## Quality gates and installed artifact

| Check | Result |
| --- | --- |
| `npm test` | PASS — Rust format/Clippy, 8 Rust tests, Vitest, CLI claims, and Playwright |
| `npm run build` | PASS — `dist/bin/switchboard` and `dist/site/` created |
| `cargo package --manifest-path crates/switchboard/Cargo.toml --locked` | PASS — 18 files, 17.6 KiB compressed |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run test:live` | PASS against production |

The built initial JavaScript is 3,506 bytes raw / 1,565 bytes gzip and CSS is 15,966 bytes raw / 4,277 bytes gzip. The existing deployment evidence records mobile Lighthouse 99 performance, 100 accessibility, 100 best practices, and 100 SEO.

The packaged `.crate` was unpacked and installed into a separate consumer directory. With the documented Pandas/Polars prerequisites, installed `switchboard demo` exited 2 and produced the three expected failed categories plus a separate `global_sort` heuristic. `switchboard init` created a starter project; a repeated init exited 3 without overwriting; `switchboard assess ... --json` then exited 0 with one passed case and `decision: "go"`.

## Earlier findings

All earlier review, polish, verification, and handoff notes were inspected. Current disposition was established by the checks above, not copied from prior reports.

| Earlier finding | Current disposition |
| --- | --- |
| F-1-1 | Fixed: both fresh first screens identify the job, audience, and one sample action. |
| F-1-2, F-1-7, F-2-1 | Fixed: direct web demo, real bundled CLI demo, recording, and populated three-difference report pass. |
| F-1-3 | Fixed: sentinel storage exercise proves demo isolation, reset behavior, and clean return to real mode. |
| F-1-4 through F-1-16; F-2-2; R5-2 | Fixed: all 12 registered claim commands pass, including the explicit 1–10 boundary check. |
| F-1-17, F-1-33 | Fixed: there is no paid tier, checkout, or license promise. |
| F-1-18 through F-1-25; F-2-3, F-2-4 | Fixed: designed 404, CSP, metadata, focus, shared chrome, external-link labeling, valid tabs, and mobile targets pass. |
| F-1-26 through F-1-32; F-1-34 through F-1-36; F-2-5 | Fixed: current copy is plain and consistent, including “schema” and “streaming warning”. |
| F-3-1, F-3-2 | Fixed: Terms accurately limits report scope and Privacy accurately states transformation-code file access; their claim commands pass. |
| R5-1 | Fixed: Start for real now returns to the bare root and `npm run test:live` passes. |
| Verification 2 low CSP observation / F-1-19 | Fixed: the live CSP is present and produces no console violation. |
| Review 4 and polish notes | No open product finding was recorded; current full and live checks remain clean. |

## Remaining work

No product repair is required. Registry publication remains factory-owned and was not attempted.
