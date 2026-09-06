# Check a Pandas-to-Polars migration — review 6

Reviewed 6 September 2026 against <https://data-engine-switchboard.sociobot.in/>.

- Implementation candidate: `0cbee8280a007d0c0080b17d014dc39e03280bec` (`chore: label repair build`).
- Documentation/evidence base: `b4b96b74f3b226065cc6424aea7bc2d40e5799c4` (`docs: add independent verification three`). The earlier documentation candidate was `f2447751b335eb49dc1d7a358fa07ef145b93624`; the difference through this base is reports and evidence only.
- Live root and the clean build have identical SHA-256: `3d658c2af5438930555150bf5ab3fb570ea243882e8dcb08ff5aa0067622819d`.

## Verdict: PASS

**PASS — 0 findings and 0 untested public claims.**

The product fulfils its CLI job: Python data engineers can run declared Pandas and Polars transformations against a bounded local fixture, obtain value/schema/row-order results, timing and peak-memory samples, separate streaming-plan warnings, and a GO or NO-GO report. The bundled sample finds the three intentional incompatibilities in one command.

## First screen before scrolling

Fresh, separate browser contexts opened the production root at 1440×900 and 390×844. Both had `scrollY` 0, no console or page errors, and only same-origin requests. Before scrolling, each showed:

| Item | Observed text |
| --- | --- |
| Job | “Check a Pandas-to-Polars migration” |
| Audience | “For Python data engineers: compare both transforms on one redacted fixture and get a go/no-go report.” |
| First action | “Try it with sample data” and “A ready sample report opens.” |

The phone action was fully inside the first viewport. The three first-screen facts are runs on your machine, fixture limit required, and no telemetry.

## Demo, routes, accessibility, and recovery

- Clicking the first action in a fresh phone context opened `/demo/`. It displayed the persistent “Demo — sample data, nothing is saved” label, Reset demo, Start for real, the self-hosted terminal recording, and a populated NO-GO result with value/tax-rounding, schema/identifier, and row-order/sort-direction differences. The recording and summary separately identify measured time/peak-memory facts and a streaming warning.
- With `real:review6-sentinel=unchanged` set before entry, demo mode added only `demo:data-engine-switchboard:opened`. Reset replaced only that demo marker. Start for real cleared the `demo:` marker, retained the real sentinel, and returned to the bare root URL. No real data was changed.
- Live checks covered `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at desktop and phone sizes: expected route titles, one H1, one main landmark, route-heading focus, canonical and social metadata, no horizontal overflow, same-origin requests, and zero Axe violations. Keyboard tabs, arrow-key selection, visible focus behavior, mobile target sizes, skip links, and reduced-motion behavior also passed the local browser suite.
- `/opt/fleet/lib/verify-url.sh` returned HTTP 200 with `lang=en`, a title, one H1, main landmark, no missing image alt text, no unnamed buttons, and no console errors. The live-suite Axe integration scanned every product route at both sizes with zero violations.
- All site links found on the landing, demo, legal, and 404 pages returned 200. The unknown-route check returned the designed recovery page with deliberate HTTP 404. This is expected behavior, not a defect.
- Live headers include `Content-Security-Policy`, `X-Content-Type-Options`, and `Referrer-Policy`. No offline or update behavior is promised. This static CLI product has no backend, tenant, health, persistence, or rate-limit surface, so tenant/restart/429 checks do not apply.

## Claims from a clean checkout

Clean checkout: `/tmp/data-engine-switchboard-review6-5Gm8Os` at `b4b96b74f3b226065cc6424aea7bc2d40e5799c4`. `npm ci` passed with zero audit vulnerabilities. The documented Pandas, Polars, and PyArrow prerequisites were installed before CLI claim checks.

| Claim | Declared command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npx playwright test --grep @claim:demo-sandbox` | PASS at desktop and phone sizes |
| `recorded-cli-demo` | `npm run test:claim -- recorded-cli-demo` | PASS |
| `report-evidence` | `npm run test:claim -- report-evidence` | PASS |
| `report-scope` | `npm run test:claim -- report-scope` | PASS |
| `cli-output-contract` | `npm run test:claim -- cli-output-contract` | PASS |
| `comparison-policy` | `npm run test:claim -- comparison-policy` | PASS |
| `sample-count-bounds` | `npm run test:claim -- sample-count-bounds` | PASS: accepts 1 and 10; rejects 0 and 11 before import |
| `fixture-bound-before-import` | `npm run test:claim -- fixture-bound-before-import` | PASS |
| `cli-local-only` | `npm run test:claim -- cli-local-only` | PASS with denied, recorded process-tree network attempts |
| `transformation-file-access` | `npm run test:claim -- transformation-file-access` | PASS |
| `site-no-analytics` | `npx playwright test --grep @claim:site-no-analytics` | PASS at desktop and phone sizes |
| `route-metadata` | `npx playwright test --grep @claim:route-metadata` | PASS at desktop and phone sizes |

Landing, demo, README, Privacy, and Terms copy was cross-checked against `.factory/claims.json`. Every public behavioral, measurement, privacy, local-data, report-scope, boundary, or route-metadata promise has an observable claim test. There are no unlisted or untested public claims.

## Quality gates and installed artifact

| Check | Result |
| --- | --- |
| `npm test` | PASS — Rust format/Clippy, 8 Rust tests, Vitest, all CLI claims, and 16 Playwright checks |
| `npm run build` | PASS — produced `dist/bin/switchboard` and `dist/site/` |
| `cargo package --manifest-path crates/switchboard/Cargo.toml --locked` | PASS — 18 files, 17.6 KiB compressed |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run test:live` | PASS — 10 route/viewport combinations, demo isolation, headers, links, and deliberate 404 |

The built initial JS is 3.51 kB raw / 1.54 kB gzip and CSS is 15.97 kB raw / 4.27 kB gzip. The installed packaged CLI was exercised in a fresh consumer directory: `--help` succeeded; `switchboard demo` returned exit 2 and produced the expected NO-GO report; `switchboard init` created a starter assessment; repeating init returned exit 3 without overwriting it. Normal, invalid, boundary, and recovery paths are also covered by the claim suite.

## Earlier findings

Reviewed: reviews 1–5, polish notes 1–3, verifications 2–3, and the prior handoff. Their current disposition was independently re-observed or re-run in this review.

| Earlier finding group | Current disposition |
| --- | --- |
| F-1-1 | Fixed: fresh desktop and phone first screens state job, audience, and sample action. |
| F-1-2, F-1-7, F-2-1 | Fixed: direct web demo, real bundled CLI demo, terminal recording, and populated three-difference output pass. |
| F-1-3 | Fixed: sentinel exercise proves demo isolation, reset, and clean return to real mode. |
| F-1-4 through F-1-16; F-2-2; R5-2 | Fixed: all 12 registered claim commands pass, including observable privacy, output, policy, bounds, and 1–10 boundary checks. |
| F-1-17, F-1-33 | Fixed: no paid tier, checkout, license, refund, or offline promise remains. |
| F-1-18 through F-1-25; F-2-3, F-2-4 | Fixed: designed 404, CSP, metadata, route focus, shared chrome, external-link labels, valid tabs, and mobile targets pass. |
| F-1-26 through F-1-32; F-1-34 through F-1-36; F-2-5 | Fixed: current copy is plain and consistent, including schema and streaming warning terms. |
| F-3-1, F-3-2 | Fixed: Terms accurately limits report scope and Privacy accurately discloses supplied-code file access; dedicated claim commands pass. |
| R5-1 | Fixed: Start for real returns to the bare root, preserves real storage, and `npm run test:live` passes. |
| Verification-2 low CSP observation / F-1-19 | Fixed: live CSP is present and produces no console violation. |
| Review 4, polish notes, verification 3 | No open product finding was recorded; this review independently reconfirms their cited paths. |

## Remaining work

No product repair is required. Registry publication and deployment remain factory-owned and were not attempted.
