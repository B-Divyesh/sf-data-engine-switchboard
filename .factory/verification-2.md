# Independent verification — PASS

Work order: `data-engine-switchboard-verify-2`  
Verified on: 28 August 2026  
Candidate: `fb308cc541b7c8153bb21f7d6cae69f101c4b528`  
Live URL: <https://data-engine-switchboard.sociobot.in/>

## Verdict

**PASS.** The candidate meets the researched brief's smallest useful product: a local-only
CLI runs declared Pandas and Polars transforms against bounded CSV/Parquet fixtures, reports
value/schema/order parity and sampled runtime/RSS, keeps streaming-plan signals explicitly
heuristic, and produces an actionable GO/NO-GO result. The seeded suite found all three
intentional incompatibilities in one command.

This was a fresh, independent verification. I cloned the public repository into a new
temporary directory, checked out the exact candidate SHA, ran `npm ci`, and did not use any
builder build products. Environment: Node `v22.23.2`, npm `10.9.8`, Rust/Cargo `1.98.0`, and
Python `3.12.3` (fresh virtual environment for the Pandas/Polars exercise).

## Automated quality gates

| Command | Result | Evidence |
| --- | --- | --- |
| `npm ci` | PASS | Clean lockfile install; 0 audit vulnerabilities. |
| `npm test` | PASS | Rust format check and Clippy with warnings denied passed; 7 Rust tests, 2 Vitest tests, and 6 Playwright tests passed. |
| `npm run build` | PASS | Exit 0. Produced `dist/bin/switchboard` (2,005,920 bytes) and `dist/site/`. |
| `cargo package --manifest-path crates/switchboard/Cargo.toml --locked` | PASS | Package verification passed; crate was 17.7 KiB compressed / 59.2 KiB unpacked. |
| `npm audit --audit-level=high` | PASS | `found 0 vulnerabilities`. |

The release site's initial code budgets are well below the static-product limits: JavaScript is
6,389 bytes raw / 3,092 bytes gzip, CSS is 14,008 bytes raw / 3,946 bytes gzip, and there are
no downloaded fonts. The responsive hero is 58,622 bytes at the mobile source and 244,290 bytes
at the desktop source.

## CLI end-to-end evidence

I installed the packed crate into a separate consumer location from the unpacked `.crate`, then
used the installed `switchboard` executable rather than the repository binary.

- `switchboard --version` returned `switchboard 0.1.0`; `--help` exposed only the documented
  `assess` and `init` commands and their help text.
- With Pandas `3.0.5` and Polars `1.44.1` in a fresh venv, `switchboard assess
  examples/seeded/switchboard.toml --json` exited **2**, emitted `decision: "no_go"`, and
  reported 3/3 failed cases with exactly the expected measured categories: `value`, `schema`,
  and `order`. The streaming sort marker was separately recorded as a heuristic.
- `switchboard init <empty-dir>` followed by `switchboard assess <empty-dir>/switchboard.toml
  --json --output report.json` exited **0**, emitted `decision: "go"`, had one passed case and
  zero failed cases, and wrote JSON byte-identical to stdout.
- Re-running `init` without `--force` exited **3** with a clear non-overwrite message.
- A config with `max_fixture_mb = 0` exited **3** with the documented `1..=512` validation
  error. A 2 MiB CSV with a 1 MiB declared limit exited **3** before transformation execution.

These checks cover the representative success path, the brief's three intentional migration
incompatibilities, bounded-fixture enforcement, invalid configuration recovery, JSON output,
and documented exit-code contract.

## Live deployment, privacy, and browser QA

The live site matches the production build exactly. SHA-256 values matched for the HTML,
hashed JS/CSS, service worker, favicon, and both hero sources. In particular:

| Asset | SHA-256 |
| --- | --- |
| `index.html` | `9ad24a28456ff49a2ceff79805f2a2b7a679e9058aa76aeacb25fef64f38689c` |
| `assets/main-BuhpBp2t.js` | `f9491475c381d5e0c0aff0de9925430ef7db475b28839f9078cfa8aa915ca424` |
| `assets/main-2OhSC_Pc.css` | `9965e17ac27a91f05c5c75dfad7b381d026d9914457193ba0c7d73667718c600` |
| `sw.js` | `de6e10c268eadfffbe984b3a876bb2a3937da413f9caa655b2b7d32fb23eafef` |

Fresh Chromium runs against the live root, at 1440px desktop and 390px mobile, found:

- one `<h1>`, one `<main>`, `lang="en"`, correct title, no horizontal overflow;
- zero console errors and zero page errors;
- zero serious or critical axe violations at both sizes;
- keyboard focus first reaches the visible skip link, with a 3px lichen outline and 6px
  charcoal offset; tab-list ArrowRight selects the next case;
- reduced-motion styles reduce both tested animation durations to `0.00001s`;
- initial resource requests use only `https://data-engine-switchboard.sociobot.in`. No analytics,
  tracker, CDN, or third-party font request occurs. The source contains only the explicit
  Sociobot verification request after a user provides a license token.

The service worker registered with scope `/`, obtained controller ownership, and cached the
shell. After a warm load, an offline reload at 390px retained the title and main landmark and
showed the offline notice. This is an offline documentation shell rather than an installable
PWA (there is no web app manifest).

Live responses use HTTPS and return HSTS, `X-Content-Type-Options: nosniff`, a restrictive
permissions policy, and `Referrer-Policy: strict-origin-when-cross-origin`. HTML and `sw.js`
are revalidated at 30 seconds; hashed JS/CSS and responsive images are immutable for one year.
`/privacy/` and `/terms/` return 200 and have one document heading each.

## Defects / observations

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low:** the live response does not send a `Content-Security-Policy` header. This does not
  block the local-first CLI or current static site behavior, but deployment should add a CSP as
  defense in depth before adding any future dynamic third-party content.

## Reproduction

```sh
npm ci
npm test
npm run build
cargo package --manifest-path crates/switchboard/Cargo.toml --locked

# with Python dependencies installed and selected by switchboard.toml's `python` command
dist/bin/switchboard assess examples/seeded/switchboard.toml --json
```

Expected seeded exit status is `2`, with `decision: "no_go"` and value, schema, and order
findings. A new starter assessment created by `dist/bin/switchboard init <directory>` should
exit `0` with `decision: "go"`.
