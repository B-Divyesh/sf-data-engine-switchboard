# Data Engine Switchboard — polish 2 handoff

Work order: `data-engine-switchboard-polish-2`

Base reviewed: `a49c54d1ed291b1e237e656d2e84ec9037c103cb`
Repair commits: `3321675bfe61097b19028c163f0c4c5af39e7890`, `24618ee6f7c8e68c8e1fdb044c1bec9a31274b56`

## Delivered

- Added a self-hosted, original SVG terminal recording of the real bundled `switchboard demo` command. It is displayed on `/demo/` beside the same command and a plain-text summary.
- Kept direct `/demo/` and `?demo=1` isolation with the persistent sample-data banner, reset, and real-mode exit.
- Expanded the claim registry to nine observable, clean-sandbox contracts. CLI privacy is now exercised with network sockets denied across the CLI process tree.
- Completed social metadata for legal and 404 routes, reflowed the 390px navigation to expose all four labels, and standardized visitor wording on “schema difference”.
- Preserved the concrete-and-moss visual system. Catalog description is a verb-first 70-character sentence.

## Verification

Local repository:

```sh
npm test
npm run build
cargo package --manifest-path crates/switchboard/Cargo.toml --locked
```

All passed. The release build produced `dist/bin/switchboard` and `dist/site/`. `cargo package` verified a 17.5 KiB compressed crate.

Fresh clone evidence: `/tmp/data-engine-switchboard-polish2-final-clean` was cloned from final pushed `main`. `npm ci` passed, then `npm run test:claims` passed all six CLI claim IDs and `npx playwright test --grep @claim:` passed all browser claim checks at desktop and 390px.

Claim IDs: `demo-sandbox`, `recorded-cli-demo`, `report-evidence`, `cli-output-contract`, `comparison-policy`, `fixture-bound-before-import`, `cli-local-only`, `site-no-analytics`, and `route-metadata` all pass. See `.factory/claims.json` for their exact commands and sandbox definitions.

Deployment: uploaded through `/opt/fleet/lib/deploy-static.sh data-engine-switchboard dist/site`; Azure deployment ID `b1c1a5f8-e58d-4547-b681-a7e54332937d` succeeded.

Cold live checks on <https://data-engine-switchboard.sociobot.in/>:

- `/opt/fleet/lib/verify-url.sh` passed: 200, 583ms load, title, `lang=en`, one H1, main landmark, all images with alt text, no unlabeled buttons, and no console errors. Evidence: `.factory/evidence/live-root/verify.json` and its desktop/mobile screenshots.
- Playwright + Axe found zero violations and zero console errors at `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at 390px. The unknown-route response is product-owned HTTP 404; browsers log that document status as a failed resource, while its rendered page has one H1/main and zero Axe violations.
- Live root returns the restrictive CSP, `nosniff`, and referrer policy. Live `/demo/` contains the banner and `switchboard-demo-recording.svg`.
- Visual evidence: `.factory/evidence/polish-2-home-mobile.png`, `.factory/evidence/polish-2-demo-mobile.png`, and `.factory/evidence/polish-2-demo-desktop.png`.

## How to run

```sh
python3 -m pip install -r examples/seeded/requirements.txt
cargo run --manifest-path crates/switchboard/Cargo.toml -- demo
```

For the web sandbox, open `/demo/` or `/?demo=1`.

## Known gaps

None. The paid feature remains intentionally absent because no production checkout is registered.
