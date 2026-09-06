# Check a Pandas-to-Polars migration — review 5

Reviewed 6 September 2026 against <https://data-engine-switchboard.sociobot.in/>.

- Implementation candidate reviewed: `39dffbe4888f53aab97e3557ce4aa9dec5250288` (`fix: close round three review findings`).
- Documentation/review SHA: `db5cfb55a0f9e6abdd7cd377e9377f86db260f2f` (`docs: add adversarial review four`).
- The `site/` source is unchanged between those SHAs. The live root and a clean build have the same SHA-256: `e173747e537251a4046f3d843420bf6ff53fc370ed7166988361a008626de806`.

## Verdict: FAIL

There are **2 findings** and **1 untested public claim**. The product paths work, but its declared live verification command fails and one public numeric claim has no claim-registry entry or observable claim test. This is not a PASS.

## First screen before scrolling

Fresh Chromium contexts at 390×844 and 1440×900 opened `/` at scroll position zero.

| Question | Answer seen without scrolling |
| --- | --- |
| Job | Check a Pandas-to-Polars migration. |
| Audience | Python data engineers deciding whether both transforms agree. |
| First action | **Try it with sample data**; the adjacent text says a ready sample report opens. |

The phone screen visibly contains the action and all three facts: runs on your machine, fixture limit required, and no telemetry. The visual system is product-specific, legible, and has no generic template treatment.

## Findings

### R5-1 — Major — Declared live verification command fails

`npm run test:live` from the clean checkout exits 1 on the deployed site. After **Start for real**, the page works and clears demo storage, but its URL is `https://data-engine-switchboard.sociobot.in/?start=real`. `tests/live-check.mjs:93` asserts the exact bare root URL instead:

```text
actual:   https://data-engine-switchboard.sociobot.in/?start=real
expected: https://data-engine-switchboard.sociobot.in/
```

This is a verification-contract failure, not an unexpected HTTP failure: the landing content returns HTTP 200 and real storage remains unchanged. Make the destination and the assertion agree, then run the live check successfully before claiming live verification.

### R5-2 — Major — “One to ten samples” is an unlisted, untested public claim

The landing page lists **“One to ten samples”** under “Choose how outputs are compared.” It has no entry in `.factory/claims.json`. The existing `comparison-policy` claim verifies schema, order, null, timezone, and float fields only; it does not exercise accepted values 1 and 10 or rejected values 0 and 11.

Register this numeric behavior as its own `@claim:` command (or remove the sentence). The sandbox test must observe the advertised bounds from a clean assessment.

## Demo and real job checks

- Clicking the first-screen action opened `/demo/` with the persistent label **“Demo — sample data, nothing is saved”**, Reset demo, and Start for real.
- A fresh phone context started with `real:sentinel=untouched`. Demo wrote only `demo:data-engine-switchboard:opened`; Reset preserved the sentinel; Start for real removed `demo:` keys and preserved the sentinel. Requests were only same-origin site assets.
- The populated sample showed a recorded no-go result with three intentional findings: value, schema, and row order. It separately labelled runtime, peak RSS, and a streaming warning.
- A release binary copied into a new consumer directory initially stopped with exit 3 until the documented Pandas/Polars prerequisites were installed. After `pip install -r examples/seeded/requirements.txt`, `switchboard demo` exited 2 as documented and generated a local report with three failed cases, runtime and peak-process-memory samples, and one `global_sort` heuristic.
- In another clean consumer directory, `switchboard init` created a starter assessment; the repeated init rejected an existing config with exit 3; then `switchboard assess switchboard.toml --json` recovered normally with exit 0 and a one-case go report. The boundary path is also exercised by the dedicated fixture-limit claim: an oversized CSV is rejected before the transform import.

## Claims and clean-checkout commands

Clean checkout: `/tmp/data-engine-switchboard-review5-clean` at `db5cfb55a0f9e6abdd7cd377e9377f86db260f2f`. `npm ci` completed with no audit vulnerabilities after documented prerequisites were installed.

| Registered claim | Declared command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npx playwright test --grep @claim:demo-sandbox` | Pass (2 browser projects) |
| `recorded-cli-demo` | `npm run test:claim -- recorded-cli-demo` | Pass |
| `report-evidence` | `npm run test:claim -- report-evidence` | Pass |
| `report-scope` | `npm run test:claim -- report-scope` | Pass |
| `cli-output-contract` | `npm run test:claim -- cli-output-contract` | Pass |
| `comparison-policy` | `npm run test:claim -- comparison-policy` | Pass |
| `fixture-bound-before-import` | `npm run test:claim -- fixture-bound-before-import` | Pass |
| `cli-local-only` | `npm run test:claim -- cli-local-only` | Pass |
| `transformation-file-access` | `npm run test:claim -- transformation-file-access` | Pass |
| `site-no-analytics` | `npx playwright test --grep @claim:site-no-analytics` | Pass (2 browser projects) |
| `route-metadata` | `npx playwright test --grep @claim:route-metadata` | Pass (2 browser projects) |

`npm test` passed: 8 Rust tests, 1 Vitest test, all CLI claims, and 16 Playwright tests. `npm run build` passed and produced `dist/bin/switchboard` and `dist/site/`. `cargo package --manifest-path crates/switchboard/Cargo.toml --locked` passed. The only failed declared verification command is `npm run test:live` (R5-1).

## Live site quality checks

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each returned 200 with their expected title, exactly one H1 and one main landmark. An unknown route returned a designed product 404 with HTTP 404; its expected browser resource error is not a defect.
- Axe found zero violations on every route above at desktop and phone sizes. Keyboard focus is a 3px high-contrast lichen outline with a charcoal offset. The site has a skip link, semantic tab controls, focusable route headings, touch-size navigation, and no horizontal phone overflow.
- Reduced motion produces only a completed 0.01 ms state rather than route animation. No offline or update promise is made, so there is no unverified offline/update claim.
- The live root sent CSP, HSTS, `nosniff`, referrer, and permissions headers. It made no analytics or third-party runtime request. `robots.txt` and the sitemap are present.
- Every product-owned link returned 200 except the intentionally requested unknown route, which returned the designed 404. The external CLI guide and issue tracker each returned 200.
- Privacy and Terms are reachable and accurately state local processing, the transformation-process file-access boundary, and report limitations. This is a static CLI product, so backend tenant isolation, restart persistence, health, and rate-limit checks do not apply.

## Earlier-finding disposition

All prior reports and verification notes were inspected. The rows below account for every earlier finding; “fixed” means independently re-observed or re-run during this review, not merely copied from an earlier report.

| Earlier finding IDs | Current disposition and evidence |
| --- | --- |
| F-1-1 | Fixed: both fresh first screens name the job, audience, and one sample action. |
| F-1-2, F-1-7, F-2-1 | Fixed: `/demo/`, `?demo=1`, the self-hosted recording, and `switchboard demo` all show the real bundled sample result. |
| F-1-3 | Fixed: fresh-sentinel demo/reset/exit test proved isolated `demo:` storage and no real-data mutation. |
| F-1-4 through F-1-6; F-1-8 through F-1-16; F-2-2 | The previously named claims remain registered and their 11 commands pass. R5-2 is a newly detected omitted landing claim, so the prior general claim-coverage conclusion is not fully sustained. |
| F-1-17, F-1-33 | Fixed: no paid tier, checkout, or license promise remains. |
| F-1-18 through F-1-25; F-2-3, F-2-4 | Fixed: designed 404, CSP and metadata, route focus/shared chrome, external-link labels, valid tabpanel, and full phone targets all passed live checks. |
| F-1-26 through F-1-32; F-1-34 through F-1-36; F-2-5 | Fixed: current first-screen and README copy remain plain, short, literal, and use “schema” and “streaming warning” consistently. |
| F-3-1, F-3-2 | Fixed: Terms states the report omissions and Privacy states the supplied-code file-access boundary; their dedicated claim commands pass. |
| Review 4 | It recorded zero new findings. Its PASS is superseded by R5-1 and R5-2 above. |

## Required next steps

1. Repair the Start-for-real URL/checker disagreement and get `npm run test:live` to exit 0 against live.
2. Add an observable claim test for the 1–10 sample bound, or remove that public claim.

