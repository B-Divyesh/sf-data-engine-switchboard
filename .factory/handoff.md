# Data Engine Switchboard — review 5 handoff

Work order: `data-engine-switchboard-review-5`.

Reviewed implementation candidate `39dffbe4888f53aab97e3557ce4aa9dec5250288`; documentation SHA `db5cfb55a0f9e6abdd7cd377e9377f86db260f2f`. Added `.factory/review-5.md`. No product code, assets, configuration, or deployment state changed.

Verified fresh desktop and phone live reads, demo isolation/reset/exit, populated sample output, consumer-installed CLI normal/invalid/recovery paths, all registered claim commands, `npm test`, `npm run build`, `cargo package`, live metadata/a11y/links/legal/404/security headers, and reduced motion. The clean build root exactly matches the live root.

Known gaps: review verdict **FAIL**. `npm run test:live` fails because Start for real uses `/?start=real` while the checker requires `/`. The public “One to ten samples” claim has neither a claims-registry entry nor an observable claim test. Details and reproduction commands are in `.factory/review-5.md`.

To verify after repair: `npm ci`, `npm test`, `npm run build`, each command in `.factory/claims.json`, then `npm run test:live` against the deployed URL. Open `/demo/` or `?demo=1` for the isolated web sample; run `switchboard demo` after installing `examples/seeded/requirements.txt` for the CLI sample.
