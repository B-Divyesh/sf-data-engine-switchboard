# Data Engine Switchboard — adversarial review 1 handoff

Work order: `data-engine-switchboard-review-1`

Reviewed candidate: `af81ae87e6baa63bef8e963c905953d9a7aff46f`

Completed: 28 August 2026

Verdict: **FAIL**

## What was done

- Reviewed the live site cold in fresh 390×844 and 1440×900 Chromium contexts.
- Audited every landing-page and README sentence, plus landing headings, buttons, and dynamic messages.
- Checked the required web/CLI demo entry points, sandbox isolation, offline behavior, and intercepted network/storage activity.
- Looked for `.factory/claims.json`, ran all listed claim commands (none existed), and ran the available general suite from a fresh clone.
- Crawled live links and routes; checked titles, headings, metadata, 404 behavior, history/focus, shared navigation, visual identity, touch targets, console output, and accessibility.
- Read the earlier handoff and verification report and rechecked their open items against live responses and repository code.
- Wrote the complete evidence-backed review to `.factory/review-1.md`.

No product code was modified.

## How to verify

```sh
npm ci
npm test
npm run build
```

Fresh-clone `npm test` passed: 7 Rust tests, 2 Vitest tests, and 6 Playwright tests. The live
factory verifier passed its basic title/lang/main/alt/console checks. A direct live Axe scan found
one remaining minor `aria-allowed-role` violation.

Key negative reproductions:

```sh
curl -I https://data-engine-switchboard.sociobot.in/demo
cargo run --manifest-path crates/switchboard/Cargo.toml -- demo
curl -L -o /dev/null -w '%{http_code}\n' \
  https://api.sociobot.in/api/v1/products/data-engine-switchboard/checkout
```

Expected current results are 404, unknown subcommand/exit 2, and 404 respectively. Browser
evidence from the basic live verifier is under `/tmp/des-review-evidence`; temporary evidence is
not committed.

## What is left

The review records 19 blocking and 17 minor findings. The highest-priority gaps are the absent
real/sandboxed demo, missing claims registry and tagged tests, paid checkout 404, generic 404,
and the still-unfixed CSP observation from the previous verification. See
`.factory/review-1.md` for exact quotes, reproductions, rewrites, and completion criteria.
