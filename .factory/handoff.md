# Data Engine Switchboard — polish 1 handoff

Work order: `data-engine-switchboard-polish-1`  
Base reviewed: `af81ae87e6baa63bef8e963c905953d9a7aff46f`  
Repair commits: `bda90edd359acfca0b380aac2baf208026fdb1a3`, `e90187b`

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

`npm test` passed locally and again from fresh clone `/tmp/des-clean-PeQW7V`: Rust formatting/Clippy, 8 Rust tests, 1 Vitest test, all 3 CLI claim tests, and 8 Playwright desktop/mobile tests. `npm run build` passed and produced `dist/bin/switchboard` and `dist/site/`. The built initial JS is 3.44 kB raw and CSS is 15.48 kB raw. `cargo package` passed at repair commit `bda90ed` (before the documentation-only follow-ups).

Claim commands are in `.factory/claims.json`; each was run through `npm test`. The CLI claim suite creates `.test-venv` from the checked-in requirements when needed, so it also works in a clean clone.

## Deploy and recheck

Deploy static output with:

```sh
/opt/fleet/lib/deploy-static.sh data-engine-switchboard dist/site
```

Deployment completed through `/opt/fleet/lib/deploy-static.sh data-engine-switchboard dist/site` on 28 August 2026. Live checks passed at `https://data-engine-switchboard.sociobot.in/`: `verify-url.sh` output and screenshots are in `/tmp/des-polish-1-evidence-final/`; live Playwright Axe returned 0 violations for `/`, `/demo/`, `/privacy/`, and `/terms/`; `/missing-review-route` returned HTTP 404 with the product-owned page; `curl -I /` returned the restrictive CSP.

## Known gaps

None. The paid tier was intentionally removed because the registered checkout returned 404; the free, local CLI is fully usable.
