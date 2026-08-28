# Adversarial first-read review 3 — Data Engine Switchboard

Reviewed: 28 August 2026
Live URL: <https://data-engine-switchboard.sociobot.in/>
Repository: `861274e0eb907cd0b014173be2e863f816877a9e`

## Verdict: FAIL

Cold first read, demo, registered claims, CLI sample, routes, and accessibility pass. Two
blocking, unlisted legal-page claims remain false or unsupported.

## Cold first screen

Fresh Chromium contexts opened the live root at 390×844 and 1440×900 without scrolling.

| Question | First-read answer | Visible evidence |
| --- | --- | --- |
| What does this do? | Checks whether a Pandas-to-Polars migration changes results. | “Check a Pandas-to-Polars migration” |
| For whom? | Python data engineers making that decision. | “For Python data engineers…” |
| What should I click first? | Try the sample to open a ready report. | “Try it with sample data” / “A ready sample report opens.” |

This passes at both widths. At 390px the primary action is fully visible at 342×48px; all
four navigation controls are in view and at least 51px high.

## Findings

### Blocking

#### F-3-1 — Terms promise report provenance that the report does not contain

- Exact location/quote: `/terms/`, Migration decisions: “Reports describe the supplied fixtures, code, environment, and installed library versions.”
- Verification: a fresh `switchboard demo` report has only `schema_version`, `tool`, `decision`, `review_recommended`, `privacy`, `comparison`, `summary`, and `cases`. It records relative fixture paths and the Switchboard version, but no code identity, Python environment, or Pandas/Polars version. No `.factory/claims.json` entry covers this promise.
- Why this fails: migration evidence cannot be reproduced or evaluated from the report as the Terms page promises.
- Concrete fix: add a tested provenance block (module path and hash, Python version, Pandas version, Polars version, execution environment) under a new `@claim:report-provenance`; or replace the sentence with “Reports describe the configured fixture and comparison results. They do not record code, environment, or library versions.”

#### F-3-2 — Privacy copy falsely limits what user-supplied transformation code can read

- Exact location/quote: `/privacy/`, The command: “It reads only the configuration, transformation modules, and fixture paths you provide.”
- Verification: `crates/switchboard/src/runner.py:19` executes the user’s module with `spec.loader.exec_module(module)`, then calls the user-selected functions at lines 88 and 122. Those arbitrary Python functions can read any file available to their Python process. The sentence has no registered claim or sandbox test.
- Why this fails: it describes a false local-data boundary. A visitor could reasonably assume a supplied transformation cannot access nearby credentials or unrelated files.
- Concrete fix: replace it with “The tool runs the transformation code you supply. That code can access files available to its Python process. Switchboard itself does not upload fixture contents, reports, code, filenames, or usage data.” Keep the no-upload statement under `cli-local-only`; add a separate sandbox-policy claim only if transformations later receive file isolation.

## Demo and sandbox

| Check | Result | Evidence |
| --- | --- | --- |
| One-click entry | PASS | Hero action opens `/demo/`; `?demo=1` redirects there. |
| First demo screen | PASS | Self-hosted terminal capture immediately shows a NO-GO result, three sample differences, runtime, peak RSS, and a separate streaming warning. |
| Banner/reset | PASS | “Demo — sample data, nothing is saved”, Reset demo, and Start for real are present. Reset retained `sb_license:data-engine-switchboard=sentinel`. |
| Storage/network | PASS | The demo wrote only `demo:data-engine-switchboard:opened`; captured browser requests were same-origin. |
| CLI demo | PASS | `TMPDIR=/tmp/des-review3-cli-* switchboard demo` exited 2 and created a unique child containing CSV, TOML, Python transform, and JSON report. |
| CLI privacy exercise | PASS for registered claim | `@claim:cli-local-only` runs the process tree with AF_INET/AF_INET6 sockets denied and still produces a local report. It does not make F-3-2 true. |

## Claims from a clean clone

Fresh clone: `/tmp/des-review3-clean-T0DcUT`; `npm ci` passed with zero audit vulnerabilities.

| Claim ID | Command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npx playwright test --grep @claim:demo-sandbox` | PASS, desktop and 390px |
| `recorded-cli-demo` | `npm run test:claim -- recorded-cli-demo` | PASS |
| `report-evidence` | `npm run test:claim -- report-evidence` | PASS |
| `cli-output-contract` | `npm run test:claim -- cli-output-contract` | PASS |
| `comparison-policy` | `npm run test:claim -- comparison-policy` | PASS |
| `fixture-bound-before-import` | `npm run test:claim -- fixture-bound-before-import` | PASS |
| `cli-local-only` | `npm run test:claim -- cli-local-only` | PASS |
| `site-no-analytics` | `npx playwright test --grep @claim:site-no-analytics` | PASS, desktop and 390px |
| `route-metadata` | `npx playwright test --grep @claim:route-metadata` | PASS, desktop and 390px |

The landing and README operational claims map to these entries: demo/recording to
`demo-sandbox` and `recorded-cli-demo`; evidence to `report-evidence`; output and paths to
`cli-output-contract`; policies to `comparison-policy`; bounds to
`fixture-bound-before-import`; and local/no-analytics assertions to `cli-local-only` and
`site-no-analytics`. F-3-1 and F-3-2 are unlisted legal-page reliance claims.

`npm test` completed after the individual claim runs; `npm run build` passed and produced
`dist/bin/switchboard` and `dist/site/`. The built static JavaScript is 1.51 kB gzip and CSS is
4.27 kB gzip.

## Copy audit

Hyphenated technical terms, flags, and identifiers count as one word. No landing or README
sentence exceeds 22 words. Pandas, Polars, TOML, CSV, Parquet, and LazyFrame are necessary
identifiers for the named Python-engineer audience. No banned marketing adjective appears.

### Landing sentences

| # | Words | Sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 16 | For Python data engineers: compare both transforms on one redacted fixture and get a go/no-go report. | — |
| 2 | 5 | A ready sample report opens. | — |
| 3 | 16 | A concrete switching plate splits one data route into moss, rubble, and dark aggregate paths. | — |
| 4 | 9 | The recorded sample shows value, schema, and row-order differences. | — |
| 5 | 10 | It also shows recorded time, memory, and a streaming warning. | — |
| 6 | 7 | A value differs in the bundled sample. | — |
| 7 | 5 | Plan warnings ask for review. | — |
| 8 | 7 | They do not decide pass or fail. | — |
| 9 | 10 | Point one TOML file at matching Pandas and Polars functions. | — |
| 10 | 14 | The command rejects a fixture over its declared limit before it imports your code. | — |
| 11 | 4 | Measured differences decide the result. | — |
| 12 | 4 | Streaming warnings remain separate. | — |
| 13 | 13 | Build it from source, then run the bundled demo in a new temporary directory. | — |
| 14 | 14 | The command has no telemetry and does not upload fixtures, reports, or transformation code. | — |
| 15 | 5 | The site has no analytics. | — |

Alternate tab text is also clear and consistent: “A schema differs in the bundled sample.” (7)
and “The same rows have a different order in the bundled sample.” (10).

### README sentences

| # | Words | Sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 11 | Data Engine Switchboard checks a Pandas-to-Polars migration from the command line. | — |
| 2 | 13 | It is for Python engineers who need evidence before changing a dataframe engine. | — |
| 3 | 9 | It runs matching transforms against a local, redacted fixture. | — |
| 4 | 11 | The report lists value, schema, row-order, time, memory, and streaming warnings. | — |
| 5 | 9 | Install Pandas and Polars, then run the one-command demo. | — |
| 6 | 12 | The command creates a new temporary directory and prints its report path. | — |
| 7 | 9 | The bundled fixture reports value, schema, and row-order differences. | — |
| 8 | 11 | Its exit code is `2` because that sample is a no-go. | — |
| 9 | 10 | The site includes a self-hosted recording of this bundled command. | — |
| 10 | 10 | Runtime and memory values in the recording vary by machine. | — |
| 11 | 5 | Build the CLI from source. | — |
| 12 | 4 | Create a starter assessment. | — |
| 13 | 9 | Edit `switchboard.toml` to name your module and redacted fixtures. | — |
| 14 | 7 | Each Pandas function returns a Pandas dataframe. | — |
| 15 | 9 | Each Polars function returns a Polars dataframe or LazyFrame. | — |
| 16 | 7 | `--json` writes the report to standard output. | — |
| 17 | 8 | `--output` writes the same JSON to a file. | — |
| 18 | 4 | The CLI never prompts. | — |
| 19 | 8 | Fixtures must be regular `.csv` or `.parquet` files. | — |
| 20 | 6 | Set `max_fixture_mb` from 1 to 512. | — |
| 21 | 7 | Paths are resolved from the config file. | — |
| 22 | 10 | It rejects an oversized fixture before importing the transformation module. | — |
| 23 | 7 | Choose strict, compatible, or ignored schema checks. | — |
| 24 | 6 | Choose strict or ignored row order. | — |
| 25 | 11 | Set null, timezone, and float comparison rules in the TOML file. | — |
| 26 | 4 | Measured output differences decide the result. | — |
| 27 | 9 | A streaming warning comes from the Polars execution plan. | — |
| 28 | 13 | It asks for review and cannot turn a measured failure into a pass. | — |
| 29 | 7 | Dataframe execution and report generation run locally. | — |
| 30 | 14 | The CLI has no telemetry and does not upload fixtures, reports, or transformation code. | — |
| 31 | 9 | The documentation site has no analytics or third-party requests. | — |
| 32 | 16 | Its one-click demo uses only a `demo:` browser-storage key and never reads a real-user storage key. | — |
| 33 | 7 | See the site’s `/privacy/` and `/terms/` pages. | — |
| 34 | 14 | Run `cargo package --manifest-path crates/switchboard/Cargo.toml --locked` to check the publishable crate without publishing it. | — |
| 35 | 1 | MIT. | — |
| 36 | 2 | See LICENSE. | — |

Headings are meaningful out of context. Controls use result-naming verbs: “Try it with sample
data”, “Open the recorded sample”, “Copy install”, “Copy demo command”, “Read the privacy
policy”, and “Read the terms”. No generic Submit, Go, or Continue control was found.

## Structure and accessibility

| Check | Result |
| --- | --- |
| Metadata and landmarks | PASS on `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, and an unknown route: own title, description, canonical, OG/Twitter, favicon, `lang`, one H1, and one main. |
| 404 and deep links | PASS: `/missing-review3-route` returns the designed product-owned HTTP 404. |
| Back/focus | PASS: initial load and a Privacy → Back transition focus the destination H1. |
| Link crawl | PASS: product links and the visibly marked GitHub external guide return 200. The skip link on a deliberate 404 is an in-document anchor, not a dead destination. |
| Shared chrome | PASS: header, skip link, four nav items, footer, Privacy/Terms, factory attribution, and build label appear on every route. |
| Headers | PASS: CSP, HSTS, `nosniff`, and `strict-origin-when-cross-origin` are live. |
| Keyboard/mobile | PASS: arrow-key tabs work; every 390px nav item is in view and ≥44px. |
| Axe | PASS: zero violations on all five real routes at 390px. |
| Visual identity | PASS: the concrete/moss plate, hard rules, narrow operations type, monospace evidence, and hardware-like controls follow `.factory/design.md`, not a generic SaaS template. |

## Earlier-review verification

All earlier review, polish, and handoff records were read. Each prior finding was verified live
and in code, not accepted from its earlier label.

| Finding | Current result |
| --- | --- |
| F-1-1 | Fixed: clear job, audience, and one action at both sizes. |
| F-1-2 | Fixed: direct demo, recording, and temp-directory CLI demo exist. |
| F-1-3 | Fixed: isolated `demo:` storage and reset preserve real sentinel data. |
| F-1-4 | Fixed: registry exists and all nine commands pass clean. |
| F-1-5 | Fixed: real sample/capture shows value, schema, and order evidence. |
| F-1-6 | Fixed: fixture-bound and same-origin checks pass. |
| F-1-7 | Fixed: recorded measurements are labelled as variable. |
| F-1-8 | Fixed: pre-import bound is exercised. |
| F-1-9 | Fixed for no-upload: process-tree network-denial test passes. |
| F-1-10 | Fixed: no paid offer or checkout claim remains. |
| F-1-11 | Fixed: license/offline marketing claims are absent. |
| F-1-12 | Fixed: README capability/install statements map to tests. |
| F-1-13 | Fixed: output, path, bound, prompt, and privacy behavior is exercised. |
| F-1-14 | Fixed: comparison policy and measured/heuristic separation are exercised. |
| F-1-15 | Fixed: unsupported package promises are absent; source build passes. |
| F-1-16 | Fixed: production license behavior is absent. |
| F-1-17 | Fixed: no checkout link exists. |
| F-1-18 | Fixed: live unknown route is designed HTTP 404. |
| F-1-19 | Fixed: live CSP is present. |
| F-1-20 | Fixed: every route has complete social metadata. |
| F-1-21 | Fixed: route load and Back focus H1. |
| F-1-22 | Fixed: shared chrome is complete at 390px. |
| F-1-23 | Fixed: external guide is marked and resolves. |
| F-1-24 | Fixed: live Axe scans are clear. |
| F-1-25 | Fixed: mobile controls are complete and ≥44px. |
| F-1-26 | Fixed: README sentences are ≤22 words. |
| F-1-27 | Fixed: fixture guidance is split and plain. |
| F-1-28 | Fixed: warning explanation is split and plain. |
| F-1-29 | Fixed: hero names the literal job. |
| F-1-30 | Fixed: sample wording is concrete. |
| F-1-31 | Fixed: workflow headings are clear verbs. |
| F-1-32 | Fixed: installation copy is literal source-build wording. |
| F-1-33 | Fixed: vague paid tier is absent. |
| F-1-34 | Fixed: README names its audience. |
| F-1-35 | Fixed: README headings are clear. |
| F-1-36 | Fixed: “schema” and “streaming warning” are consistent. |
| F-2-1 | Fixed: self-hosted terminal recording matches fresh CLI decision/findings/heuristic. |
| F-2-2 | Fixed for landing/README claims; F-3-1 and F-3-2 are new unlisted legal-page claims. |
| F-2-3 | Fixed: legal and 404 social metadata is complete. |
| F-2-4 | Fixed: all mobile navigation labels are visible. |
| F-2-5 | Fixed: sample language uses “schema” consistently. |

## Missed leverage

No finding. The brief calls for deterministic local comparison evidence, JSON output, and
bounded fixtures; these are present. AI would not make this decision more honest, and no
decorative AI integration or embedded provider key was found.

## What would make this perfect

Correct F-3-1 and F-3-2, register and exercise any retained new promise, then rerun the nine
claim commands from a fresh clone and repeat the cold-read and legal-copy audit. Only zero
findings merits PASS.
