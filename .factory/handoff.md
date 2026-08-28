# Data Engine Switchboard — polish 1 handoff

Work order: `data-engine-switchboard-polish-1`  
Base reviewed: `af81ae87e6baa63bef8e963c905953d9a7aff46f`

## Delivered

- Repaired every review finding in `.factory/polish-1.md`.
- Added an isolated one-click web demo at `/demo/` and `?demo=1`, plus `switchboard demo` for the same bundled data.
- Removed the unavailable paid checkout and all licensing/payment code instead of shipping a broken offer.
- Added claim registry, actual CLI/browser claim tests, product 404, metadata, shared route chrome, focus handling, mobile targets, and CSP.
- Preserved the concrete-and-moss switch-room visual system and original project art. OG and Apple assets are derived crops of the documented original hero asset.

## Verification

Run from a clean clone:

```sh
npm ci
npm test
npm run build
cargo package --manifest-path crates/switchboard/Cargo.toml --locked
```

`npm test` passed locally: Rust formatting/Clippy, 8 Rust tests, 1 Vitest test, all 3 CLI claim tests, and 8 Playwright desktop/mobile tests. `npm run build` passed and produced `dist/bin/switchboard` and `dist/site/`. The built initial JS is 3.44 kB raw and CSS is 15.48 kB raw. `cargo package` must run after committing because Cargo refuses a dirty package tree.

Claim commands are in `.factory/claims.json`; each was run through `npm test`. The CLI claim suite creates `.test-venv` from the checked-in requirements when needed, so it also works in a clean clone.

## Deploy and recheck

Deploy static output with:

```sh
/opt/fleet/lib/deploy-static.sh data-engine-switchboard dist/site
```

Then run `/opt/fleet/lib/verify-url.sh https://data-engine-switchboard.sociobot.in/ <evidence-dir>`, inspect `/demo/`, `/privacy/`, `/terms/`, unknown-route 404, and `curl -I` for CSP. Live evidence and final commit SHA are appended after deployment.

## Known gaps

None. The paid tier was intentionally removed because the registered checkout returned 404; the free, local CLI is fully usable.
