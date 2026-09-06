# Data Engine Switchboard — repair 1 handoff

Work order: `data-engine-switchboard-repair-1`

Live URL: <https://data-engine-switchboard.sociobot.in/>

Implementation SHA: `0cbee8280a007d0c0080b17d014dc39e03280bec`

Review base: `88c320435974d4ebde51cd76e4927b6e2efeca90`

## What changed

- **R5-1 fixed:** Start for real now links to `/`, clears only `demo:` storage, preserves the real-data sentinel, and lands on the exact bare root. The local demo claim and deployed live suite both exercise the outcome.
- **R5-2 fixed:** `sample-count-bounds` is registered in `.factory/claims.json`. Its real CLI sandbox accepts 1 and 10, records that many samples for both engines and both measured fields, and rejects 0 and 11 before importing transformation code.
- The README documents the same 1–10 boundary. The copy audit covers the added sentences.
- Every route identifies the deployed build as `repair-1`.

All earlier reports, verification notes, handoffs, and minor findings were read. F-1-1 through F-1-36, F-2-1 through F-2-5, and F-3-1/F-3-2 remain closed under the current clean tests and live route checks. No paid offer, offline/update promise, AI feature, or backend is advertised, so billing metadata and backend/offline checks do not apply.

## Clean verification

Fresh clone: `/tmp/data-engine-switchboard-repair1-clean-KN4qVw` at the implementation SHA.

- `npm ci`: pass; zero audit vulnerabilities.
- All 12 commands in `.factory/claims.json`, run individually: pass.
- `npm test`: pass — 8 Rust tests, 1 Vitest test, all CLI claims, and 16 Playwright runs.
- `npm run build`: pass — `dist/bin/switchboard` and `dist/site/`; initial JS is 3.51 kB raw/1.54 kB gzip and CSS is 15.97 kB raw/4.27 kB gzip.
- `cargo package --manifest-path crates/switchboard/Cargo.toml --locked`: pass — 18 files, 17.6 KiB compressed.
- `npm audit --audit-level=high`: pass; zero vulnerabilities.
- Clean consumer: installed the packaged crate under `/tmp/data-engine-switchboard-consumer-9Ph2lE`. Version/help, the three-failure demo, duplicate-init rejection, starter recovery, one-case GO result, and byte-identical stdout/output JSON all passed.

## Deployment and cold live verification

- Azure Static Web Apps deployment `6b8826cc-a719-47a0-9b41-28c284cf23f9`: succeeded against the existing `sf-data-engine-switchboard` resource and production custom domain.
- `npm run test:live`: pass for 10 route/viewport combinations. Fresh desktop and 390×844 contexts had zero Axe violations, console errors, page errors, or horizontal overflow.
- The one-click sample showed the persistent demo label and realistic populated report. Reset retained the real-data sentinel. Start for real removed demo storage, retained the sentinel, and landed on `/`.
- Root verification: HTTPS 200, `lang=en`, one H1, one main, complete alt text, named buttons, and no console errors. Evidence is under `.factory/evidence/repair-1-live*`.
- Root, Demo, Privacy, Terms, JS, CSS, robots, and sitemap bytes match the clean build. Root SHA-256: `3d658c2af5438930555150bf5ab3fb570ea243882e8dcb08ff5aa0067622819d`.
- An unknown product route returns the designed page with deliberate HTTP 404.
- Mobile Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100; LCP 2.10 s, CLS 0, total blocking time 32 ms. Evidence: `.factory/evidence/repair-1-lighthouse.json`.
- `.factory/catalog-description.txt` is verb-first and 88 visible characters. It was copied to `/work/.evidence/catalog-description.txt`.

## Run it

```sh
npm ci
npm test
npm run build
cargo package --manifest-path crates/switchboard/Cargo.toml --locked
npm run test:live
```

For the CLI sample, install `examples/seeded/requirements.txt`, then run `switchboard demo`. The expected sample exit is 2 because it intentionally finds value, schema, and row-order differences.

## Remaining work

No repair finding remains open. Registry publication is factory-owned and was not attempted.

---

## Independent verification 3

Work order: `data-engine-switchboard-verify-3`
Verified implementation: `0cbee8280a007d0c0080b17d014dc39e03280bec`
Verified documentation: `f2447751b335eb49dc1d7a358fa07ef145b93624`

Verdict: **PASS** — zero findings and zero untested public claims. The independent report is `.factory/verification-3.md`.

- Fresh desktop and phone contexts confirmed the job, audience, and sample first action without scrolling; Axe found zero violations.
- The live sample preserves real storage, resets only `demo:`, and Start for real returns to `/`.
- All 12 declared claim commands, `npm test`, `npm run build`, `cargo package`, `npm audit`, and `npm run test:live` pass from a clean checkout.
- A separately installed packaged CLI exercised the intentional three-failure demo, safe repeated-init rejection, and starter-project recovery.
- The clean build root matches the live root by SHA-256. Existing deployment evidence records mobile Lighthouse 99 performance and 100 accessibility.

No product changes were made by this verification. Registry publication remains factory-owned.
