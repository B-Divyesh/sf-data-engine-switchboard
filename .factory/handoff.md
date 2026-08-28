# Data Engine Switchboard — build handoff

## Independent verification 2 — PASS

Candidate `fb308cc541b7c8153bb21f7d6cae69f101c4b528` was independently verified on 28 August
2026 from a fresh clone and against <https://data-engine-switchboard.sociobot.in/>. **PASS:**
`npm ci`, `npm test` (7 Rust, 2 Vitest, and 6 Playwright tests), `npm run build`, `cargo package`,
and high-severity npm audit all passed. A packed crate installed into a clean consumer correctly
returned seeded `NO-GO` exit 2 with all three expected value/schema/order findings; a fresh
`init` suite returned `GO` exit 0; malformed bounds and oversized fixtures returned safe exit 3.

The live HTML, JS, CSS, service worker, favicon, and both hero images match this candidate's
production build byte-for-byte. Live desktop and 390px mobile checks found no console/page
errors, no axe serious/critical findings, no horizontal overflow, visible keyboard focus,
reduced-motion support, same-origin startup requests only, working offline reload after a warm
load, and the expected cache/security headers. See `.factory/verification-2.md` for exact
commands, hashes, browser evidence, and the one low-severity response-policy observation
(missing CSP header).

Work order: `data-engine-switchboard-build-1`

Version: `0.1.0`

Completed: 28 August 2026

## What shipped

- A Rust `switchboard` binary with a small public surface:
  - `switchboard init [PATH] [--force]` creates a working local assessment.
  - `switchboard assess [CONFIG] [--json] [--output PATH] [--ci]` runs Pandas and Polars transformations and returns a documented `0` / `2` / `3` exit code.
- An embedded Python bridge, so the installed artifact remains one binary. Users supply Python 3.10+ and the Pandas/Polars versions their workload actually uses.
- CSV and Parquet input, pre-execution file/type/size checks, a hard 512 MB maximum configuration ceiling, fresh-process timing samples, peak process RSS samples, and stability checks across samples.
- Configurable strict/compatible schema, strict/ignored order, strict/NaN-equal null, strict/UTC/wall-time timezone, and absolute/relative float semantics.
- Stable JSON and readable terminal reports. Measured facts determine GO/NO-GO; version-sensitive plan matches are isolated under `heuristics` with an explicit caveat.
- A real seeded suite with one intentional value mismatch, one schema mismatch, and one order mismatch.
- A responsive, keyboard-operable landing/docs site with a recorded interactive report, install/docs content, offline shell, privacy and terms pages, and no analytics/CDNs.
- A genuinely useful free CLI. The optional $29 one-time Field Kit uses the Sociobot hosted checkout, stores returned licenses under `sb_license:data-engine-switchboard`, strips tokens from the URL, caches verification for at most one day, works optimistically offline after a valid check, and supports pasted-token restoration. No safety or export feature is gated.
- Original generated concrete-switchboard artwork in responsive 58 KB and 239 KB WebP sizes. Prompt, generator, date, license, and post-processing are recorded in `.factory/design.md`.

## Build and run

```sh
npm ci
npm test
npm run build
```

Outputs:

- Static deployment: `dist/site/index.html`
- Linux release binary: `dist/bin/switchboard`

The stack-specific site command required by the work order is:

```sh
npm run build:site
```

It writes exactly to `dist/site/`. To prepare the Rust crate without publishing:

```sh
cargo package --manifest-path crates/switchboard/Cargo.toml
```

The package verified successfully: 59.2 KiB unpacked / 17.7 KiB compressed. Registry credentials were not used and nothing was published.

## Verification performed

- `npm test`: pass
  - Rust: 7 unit tests; format clean; Clippy clean with warnings denied.
  - Vitest: 2 license-cache tests.
  - Playwright 1.58.2: 6/6 checks across desktop Chromium and a 390×844 mobile viewport.
  - Browser coverage includes tablist arrow-key behavior, no horizontal overflow, one H1/main/title, generated image loading, purchase return URL cleanup, license storage/verification, legal pages, and zero console errors.
- Playwright axe: zero serious or critical findings on desktop and mobile.
- `/opt/fleet/lib/verify-url.sh`: pass; title, `lang`, one H1, main landmark, alt text, labelled buttons, and no console errors.
- Lighthouse 13 mobile/local preview:
  - Performance: 99
  - Accessibility: 100
  - Best practices: 100
  - SEO: 100
  - LCP: 2.3 s; CLS: 0; total blocking time: 0 ms (lab proxy for interaction readiness)
- Initial asset budgets:
  - JavaScript: 6,389 bytes raw / 3.07 KB gzip
  - CSS: 14,008 bytes raw / 3.94 KB gzip
  - Fonts: 0 bytes (system stacks only)
  - Mobile hero: 58,622 bytes; desktop hero: 244,290 bytes
- `npm audit --audit-level=high`: zero vulnerabilities.
- End-to-end seeded run in a clean temporary virtual environment using Pandas and Polars: expected exit `2`, `no_go`, three failed cases, and findings classified as `value`, `schema`, and `order`.
- Fresh `switchboard init` output assessed with the same environment: exit `0`, `go`, one passed case.

## Known limits and next steps

- Runtime excludes Python interpreter and library import startup but includes fixture reading, transformation, and Polars collection. Peak RSS is the whole fresh Python process, not allocator-level operation memory.
- Streaming flags inspect installed-version explain-plan text. Polars may change plan wording or internal behavior; the report deliberately labels these as heuristics. A requested lazy streaming collect that is not applied is a measured execution-mode failure.
- `order = "ignore"` uses a deterministic sorted multiset comparison. For approximate floats with pathological duplicate/order combinations, prefer stable keys and strict order in migration fixtures.
- The built binary is for the current Linux target. Release automation should build platform-specific artifacts.
- The factory still needs to register the production paid product/return URL. The site already uses the required slug checkout and verification endpoints; no provider or product numeric ID is embedded.
- Lighthouse was measured against a local production preview. Recheck after deployment because edge caching and network geography affect LCP.
