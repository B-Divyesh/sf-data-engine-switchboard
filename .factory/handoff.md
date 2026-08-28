# Data Engine Switchboard — polish 3 handoff

Work order: `data-engine-switchboard-polish-3`

Released candidate: `861274e0eb907cd0b014173be2e863f816877a9e`

Adversarial review: `78cabd32146f0e03b16679272ddaddfe2dd9005e`

Repair commits: `39dffbe4888f53aab97e3557ce4aa9dec5250288`, `f845746745a331620f05e61011f69b4c9191dbf4`

Live URL: <https://data-engine-switchboard.sociobot.in/>

## Delivered

- Corrected Terms to state the report’s real scope: configured fixture and comparison results, without code identity, Python details, or dataframe library versions.
- Corrected Privacy to disclose that supplied transformation code retains its Python process file access. The no-upload promise now refers to Switchboard itself.
- Added `report-scope` and `transformation-file-access` claims. The latter runs supplied code that reads an undeclared sentinel file.
- Strengthened `cli-local-only`: its injected process-tree guard writes a marker on any socket attempt, then asserts no marker exists.
- Strengthened the one-click demo test: it starts from the first-screen action, checks direct `?demo=1`, preserves a real-data sentinel, resets, exits, and confirms demo data is discarded.
- “Start for real” now clears the `demo:` namespace before returning home.
- Expanded route tests for exact titles, canonicals, descriptions, per-route Axe scans, overflow, reduced motion, focus, Back, and phone action placement.
- Added a real privacy contact link, visibly marked external, and retained the concrete switch-room/moss identity.
- Updated the catalog description to: “Check Pandas-to-Polars migrations with bounded local fixtures and JSON go/no-go reports.”
- Updated `.factory/copy-audit.md`, `.factory/demo.md`, and the exhaustive `.factory/polish-3.md` finding map.

## Clean-clone verification

Fresh clone: `/tmp/data-engine-switchboard-polish3-clean-QVqfjs` at `39dffbe4888f53aab97e3557ce4aa9dec5250288`; `npm ci` completed with zero audit vulnerabilities.

Every command listed in `.factory/claims.json` ran individually and passed: 11/11. This includes three browser claims at desktop and 390 px and eight fresh-temp CLI claims.

The complete gate also passed:

```sh
npm test
npm run build
cargo package --manifest-path crates/switchboard/Cargo.toml --locked
npm audit --audit-level=high
```

Results:

- Rust: format, Clippy with warnings denied, and 8 unit tests passed.
- Site unit tests: 1 passed.
- Playwright: 16 passed across desktop Chrome and a 390×844 phone viewport.
- Axe: zero violations on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at both viewports.
- Build: `dist/bin/switchboard` is 2,027,040 bytes. Site JS is 3,561 bytes raw / 1.56 kB gzip; CSS is 15,969 bytes raw / 4.27 kB gzip.
- Package: 18 files, 60.0 KiB unpacked / 17.5 KiB compressed.
- Audit: zero vulnerabilities.
- Offline/privacy exercise: the CLI completed its bundled demo with AF_INET/AF_INET6 denied throughout the process tree and made zero recorded socket attempts. The site makes only same-origin requests. No browser offline promise is published.

## Performance and accessibility evidence

Local mobile Lighthouse: performance 99, accessibility 100, best practices 100, SEO 100; LCP 2.3 s, CLS 0, TBT 0 ms. The initial JS, CSS, font, and hero budgets all pass; the product downloads no web font. Full JSON: `.factory/evidence/polish-3-local/lighthouse.json`.

Local visual evidence:

- `.factory/evidence/polish-3-local/home-mobile.png`
- `.factory/evidence/polish-3-local/demo-mobile.png`
- `.factory/evidence/polish-3-local/privacy-desktop.png`
- `.factory/evidence/polish-3-local/terms-desktop.png`

## Deployment and cold live verification

Deployed `dist/site` through `/opt/fleet/lib/deploy-static.sh data-engine-switchboard dist/site`. Azure Static Web Apps deployment `ad45b9b7-3294-42a3-a701-c1be14085d2d` succeeded, and the custom domain returned HTTPS 200.

`/opt/fleet/lib/verify-url.sh` passed on the cold live root in 807 ms with no console errors, `lang=en`, one H1, one main, complete image alternatives, and named buttons. Evidence: `.factory/evidence/polish-3-live-root/verify.json` plus its desktop/mobile screenshots.

`npm run test:live` then checked 10 route/viewport combinations and passed:

- Exact route titles, descriptions, canonicals, OG/Twitter metadata, one H1/main, focus, Back, and no horizontal overflow.
- Zero Axe violations on all five named routes at desktop and 390 px.
- First-screen action visible at 390×844; all four mobile navigation targets complete and at least 44 px high.
- One-click and direct-query demo entry, persistent banner, Reset demo, Start for real, real-data sentinel preservation, demo namespace deletion, and same-origin requests only.
- Correct Terms and Privacy boundary sentences live; the former false sentences are absent.
- `/missing-polish-3-route` returns the designed product-owned HTTP 404.
- All internal links and both visibly marked GitHub links return 2xx.
- CSP, HSTS, `nosniff`, referrer policy, and permissions policy are live.

Live evidence is under `.factory/evidence/polish-3-live/`, including `live-check.json` and full-page mobile screenshots. The deployed HTML is byte-identical to the local build:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `e173747e537251a4046f3d843420bf6ff53fc370ed7166988361a008626de806` |
| `privacy/index.html` | `ab6012806ff0d36bdd7f3f40fe05c6f11be9ddb8627e92e19dee2f0e939cb807` |
| `terms/index.html` | `cfbed50d41f031ff8b2f015cbd3b1bfe2bee15f8471f4b6c18b38474ee216318` |
| `assets/main-Bhvqflit.js` | `1c738bdfbac497525b1a6d71d25b8e6e9477dc1153e77af5ac5de8cfd153661f` |
| `assets/main-Cx3MQGlM.css` | `748a499c19f28af4542395522acce8f3f0ba1dab631ac01631a07dba895d8268` |

## How to run

```sh
npm ci
npm test
npm run build
python3 -m pip install -r examples/seeded/requirements.txt
cargo run --manifest-path crates/switchboard/Cargo.toml -- demo
```

Open `/demo/` or `/?demo=1` for the isolated web sample. Run `LIVE_BASE_URL=https://data-engine-switchboard.sociobot.in/ npm run test:live` for the post-deploy suite.

## Known gaps

None. All findings in reviews 1–3 are resolved, tested, deployed, and cold-checked.
