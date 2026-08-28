# Data Engine Switchboard — review 2 handoff

Work order: data-engine-switchboard-review-2
Reviewed commit: a49c54d1ed291b1e237e656d2e84ec9037c103cb

## Delivered

- Added the independent, non-code-changing review at .factory/review-2.md.
- Did not modify product code, dependencies, assets, or deployment configuration.

## Verification performed

- Used fresh live Chromium contexts at 390×844 and 1440×900 before scrolling.
- Cloned the repository to /tmp/des-review2-clean-Dbj96q, ran npm ci, and ran every command registered in .factory/claims.json; all six passed.
- Ran the CLI demo with a fresh TMPDIR; it exited 2 and created its sample fixture, TOML, transform, and JSON report in one unique temporary directory.
- Checked live demo storage with a real-key sentinel; demo used only demo:data-engine-switchboard:opened, Reset preserved the sentinel, and the browser flow made same-origin requests only.
- Checked live CSP, 404, deep links, H1 focus after navigation/back, link destinations, 390px overflow, metadata, and Axe. Axe found zero violations on /, /demo/, /privacy/, /terms/, and /404.html.

## Result and remaining work

The verdict is FAIL. See .factory/review-2.md for evidence and fixes.

1. Add a self-hosted recording/artifact of the real switchboard demo execution; the web demo is currently a hand-written report.
2. Register and observably test every remaining README/landing contract claim, especially local/no-upload privacy, output modes, comparison policy, and report metrics.
3. Complete legal/404 social metadata, make the 390px Terms navigation control fully visible, and use one term for schema/type differences.

To reproduce the baseline checks from a clean clone:

    npm ci
    npm test
    npm run build
