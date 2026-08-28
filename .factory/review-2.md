# Adversarial first-read review 2 — Data Engine Switchboard

Reviewed: 28 August 2026
Live URL: https://data-engine-switchboard.sociobot.in/
Repository reviewed: a49c54d1ed291b1e237e656d2e84ec9037c103cb

## Verdict: FAIL

Two blocking findings remain: the CLI-class web demo is a hand-written report rather than a
recording of the real CLI, and public claims remain broader than the claim registry and its
observable tests. Three minor findings remain.

## Cold first screen

Fresh Chromium contexts opened the live root at 390×844 and 1440×900 without scrolling.

| Question | First-read answer | Exact first-screen evidence |
| --- | --- | --- |
| What does this do? | Checks whether a Pandas-to-Polars migration changes results. | “Check a Pandas-to-Polars migration” |
| For whom? | Python data engineers making that migration decision. | “For Python data engineers…” |
| What should I click first? | Try the sample data; a ready report opens. | “Try it with sample data” / “A ready sample report opens.” |

This passes at both sizes. The primary action is visible at 390px without scrolling.

## Findings

### Blocking

#### F-2-1 — The one-click CLI demo is a static report, not evidence of the real CLI run

- Reopens F-1-2 and the provenance portion of F-1-7.
- Exact location/quote: /demo/ says “This sample has three intentional differences. Run the same sample with switchboard demo.” The landing says, “It is a readable record of the bundled CLI demo.” site/src/demo.ts instead contains three hand-written strings, including tax rounding changes a value and identifier changes schema.
- Verification: switchboard demo did run in a new TMPDIR, exited 2, and printed real sampled runtime, peak RSS, three measured differences, and a streaming-plan heuristic. None of that output or an artifact derived from it appears in the web demo. The first /demo/ screen is a static three-item list, not a terminal recording.
- Why this fails: the CLI demo contract requires a self-hosted terminal recording of the real binary doing its main job, plus the command. A visitor can only inspect duplicated copy and cannot distinguish it from a current CLI result. The static page also hides the brief’s time, memory, and plan evidence.
- Concrete fix: commit a self-hosted asciinema or SVG recording generated from switchboard demo against the bundled fixture. Show it on the landing or /demo/, label volatile measurements as its recorded environment, and keep the command beside it. Add a claim test that runs the bundled command and verifies the recording/report fixture has the same decision, value/schema/order findings, and heuristic label.

#### F-2-2 — Claim coverage is incomplete and the CLI privacy test is not an observable sandbox test

- Reopens F-1-4, F-1-5, F-1-6, F-1-9, F-1-12, F-1-13, F-1-14, F-1-15, and F-1-16.
- Exact location/quotes: .factory/claims.json has six entries, while the landing/README also promise: “It is a readable record of the bundled CLI demo.”; “Measured output differences decide the result.”; “Streaming warnings remain separate.”; “The command does not upload fixtures, reports, or transformation code.”; “The report lists value, type, row-order, time, memory, and streaming warnings.”; “--json writes the report to standard output.”; “--output writes the same JSON to a file.”; “The CLI never prompts.”; “Paths are resolved from the config file.”; and “Choose strict, compatible, or ignored type checks.”
- Verification: every registered command passed from fresh clone /tmp/des-review2-clean-Dbj96q. However, @claim:cli-local-no-telemetry only reads runner.py and asserts a regular expression and source sentence. It does not run the CLI under network interception/denial and cannot demonstrate the broader no-upload promise. @claim:sample-report only checks rendered static text; it does not tie the web result to bundled CLI output.
- Why this fails: these are public behavioural and privacy promises. Source-text assertions and a hand-written web list are not demo-sandbox observations of the promised outcomes. The earlier untested README/privacy contract findings are therefore not fixed.
- Concrete fix: remove each untestable promise or add one registry entry and one tagged demo-only test per claim. At minimum test JSON/file output equivalence, no prompt, config-relative paths, schema/order/null/timezone/float modes, measured-versus-heuristic separation, report time/RSS fields, and the CLI-demo-to-recording relationship. Run the CLI demo in a fresh temp directory with network denied/intercepted for its process tree and assert only stated local files are created. Narrow “no analytics or payment flow” to the registered analytics claim or test payment flow too.

### Minor

#### F-2-3 — Legal and 404 routes have incomplete social metadata

- Exact location/evidence: live /privacy/ and /terms/ include twitter:card but lack twitter:title, twitter:description, and twitter:image. Live /404.html and a missing route have title, description, canonical, and favicon but no Open Graph or Twitter tags.
- Why this matters: shares of these real routes lack the product-controlled title, description, and original image required by the site contract.
- Concrete fix: give Privacy, Terms, and 404 their own OG and Twitter title, description, and image tags; test every route’s metadata.

#### F-2-4 — The 390px header clips the Terms control and leaves only a 29px visible target

- Reopens/regresses F-1-22 and F-1-25.
- Exact location/evidence: on live 390px root and /demo/, the Terms link rectangle is x=361–433 while the viewport ends at x=390. Only 1,798 of 4,464 square pixels are visible; the screenshot shows only “T”. Its visible target is 29×62px, below the 44px touch-target baseline.
- Why this matters: a phone visitor cannot read the last legal destination and has no cue that the navigation horizontally scrolls.
- Concrete fix: use a compact menu/disclosure below the breakpoint, or reflow the header so all four complete labels and 44px targets are visible. Add a 390px test for complete in-viewport nav controls.

#### F-2-5 — “Type” and “schema” describe the same sample difference inconsistently

- Exact location/quote: landing copy says “a value, type, and row-order difference”; /demo/ says “Type: identifier changes schema”; real CLI output labels the finding Schema; .factory/claims.json says “value, type, and row-order differences.”
- Why this matters: visitors cannot tell whether type and schema are two checks or two names for one outcome.
- Concrete fix: choose “schema difference” everywhere. For example: “The sample report shows value, schema, and row-order differences.”

## Demo and sandbox checks

| Check | Result | Evidence |
| --- | --- | --- |
| One-click action and direct URL | PASS | Hero action opens /demo/; ?demo=1 redirects to /demo/. |
| First demo screen | FAIL — F-2-1 | Three-item static report, not a real CLI recording/artifact. |
| Demo banner | PASS | “Demo — sample data, nothing is saved”, Reset demo, and Start for real are present. |
| Separate storage | PASS | With real:sentinel=must-stay, demo stored only demo:data-engine-switchboard:opened; Reset retained the sentinel. |
| Demo network requests | PASS | Browser flow requested only the product origin. |
| CLI demo in temp directory | PASS | TMPDIR=/tmp/des-review2-cli-* switchboard demo exited 2 and created bundled CSV, TOML, Python transform, and JSON report under one unique temp child. |
| CLI privacy test method | FAIL — F-2-2 | Registered test is source inspection, not an intercepted/denied command flow. |

No offline claim is displayed, so no unsupported offline claim was inferred. AI is not missing leverage here: the brief calls for deterministic local comparison evidence; an AI feature would not improve the core decision honestly.

## Claim commands from a clean clone

Fresh clone: /tmp/des-review2-clean-Dbj96q at the reviewed commit; npm ci completed first.

| Claim id | Registered command | Result |
| --- | --- | --- |
| demo-sandbox | npx playwright test --grep @claim:demo-sandbox | PASS, desktop and 390px |
| sample-report | npx playwright test --grep @claim:sample-report | PASS, desktop and 390px |
| site-no-analytics | npx playwright test --grep @claim:site-no-analytics | PASS, desktop and 390px |
| cli-demo-report | npm run test:claim -- cli-demo-report | PASS |
| fixture-bound-before-import | npm run test:claim -- fixture-bound-before-import | PASS |
| cli-local-no-telemetry | npm run test:claim -- cli-local-no-telemetry | PASS, but inadequate method; F-2-2 |

## Structure and accessibility checks

| Check | Result |
| --- | --- |
| Root title, lang, one H1/main, description, canonical, favicon, theme color | PASS |
| Demo title and metadata | PASS |
| Privacy/Terms/404 social metadata | FAIL — F-2-3 |
| CSP, nosniff, referrer policy | PASS; root sends the restrictive CSP. |
| Designed 404 and unknown-route status | PASS; /missing-review2-route is product-owned HTTP 404. |
| Deep links, reload, Back focus | PASS; Privacy and Back each focus the destination H1. |
| Link crawl | PASS; all internal links and marked GitHub external guide returned 200. |
| Header/footer | PASS except clipped 390px Terms control — F-2-4. |
| Keyboard/Axe | PASS; live Axe found zero violations on /, /demo/, /privacy/, /terms/, /404.html. |
| Visual identity | PASS; concrete/moss plate, hard rules, stencil-like type, and original art follow .factory/design.md, not a generic SaaS template. |

## Complete copy audit

Counts treat hyphenated terms, command flags, and identifiers as one word. No landing or README sentence exceeds 22 words. There are no banned marketing adjectives. F-2-2 means an unlisted or unobservably tested reliance claim; F-2-5 marks type/schema terminology.

### Landing sentences

| # | Words | Sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 16 | For Python data engineers: compare both transforms on one redacted fixture and get a go/no-go report. | — |
| 2 | 5 | A ready sample report opens. | — |
| 3 | 15 | A concrete switching plate splits one data route into moss, rubble, and dark aggregate paths. | — |
| 4 | 10 | The sample report shows a value, type, and row-order difference. | F-2-5 |
| 5 | 10 | It is a readable record of the bundled CLI demo. | F-2-1, F-2-2 |
| 6 | 10 | Point one TOML file at matching Pandas and Polars functions. | F-2-2 |
| 7 | 14 | The command rejects a fixture over its declared limit before it imports your code. | covered: fixture-bound |
| 8 | 6 | Measured output differences decide the result. | F-2-2 |
| 9 | 4 | Streaming warnings remain separate. | F-2-2 |
| 10 | 14 | Build it from source, then run the bundled demo in a new temporary directory. | F-2-2 |
| 11 | 10 | The command does not upload fixtures, reports, or transformation code. | F-2-2 |
| 12 | 8 | The site has no analytics or payment flow. | analytics covered; payment flow F-2-2 |

### README sentences

| # | Words | Sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 11 | Data Engine Switchboard checks a Pandas-to-Polars migration from the command line. | F-2-2 |
| 2 | 13 | It is for Python engineers who need evidence before changing a dataframe engine. | — |
| 3 | 9 | It runs matching transforms against a local, redacted fixture. | F-2-2 |
| 4 | 11 | The report lists value, type, row-order, time, memory, and streaming warnings. | F-2-2, F-2-5 |
| 5 | 9 | Install Pandas and Polars, then run the one-command demo. | — |
| 6 | 12 | The command creates a new temporary directory and prints its report path. | F-2-2 |
| 7 | 15 | The bundled fixture deliberately reports one value difference, one type difference, and one row-order difference. | cli demo covered; F-2-5 |
| 8 | 11 | Its exit code is 2 because that sample is a no-go. | F-2-2 |
| 9 | 5 | Build the CLI from source. | — |
| 10 | 4 | Create a starter assessment. | — |
| 11 | 9 | Edit switchboard.toml to name your module and redacted fixtures. | F-2-2 |
| 12 | 7 | Each Pandas function returns a Pandas dataframe. | F-2-2 |
| 13 | 9 | Each Polars function returns a Polars dataframe or LazyFrame. | F-2-2 |
| 14 | 7 | --json writes the report to standard output. | F-2-2 |
| 15 | 8 | --output writes the same JSON to a file. | F-2-2 |
| 16 | 4 | The CLI never prompts. | F-2-2 |
| 17 | 8 | Fixtures must be regular .csv or .parquet files. | F-2-2 |
| 18 | 6 | Set max_fixture_mb from 1 to 512. | F-2-2 |
| 19 | 7 | Paths are resolved from the config file. | F-2-2 |
| 20 | 10 | It rejects an oversized fixture before importing the transformation module. | covered: fixture-bound |
| 21 | 7 | Choose strict, compatible, or ignored type checks. | F-2-2 |
| 22 | 6 | Choose strict or ignored row order. | F-2-2 |
| 23 | 11 | Set null, timezone, and float comparison rules in the TOML file. | F-2-2 |
| 24 | 6 | Measured output differences decide the result. | F-2-2 |
| 25 | 9 | A streaming warning comes from the Polars execution plan. | F-2-2 |
| 26 | 13 | It asks for review and cannot turn a measured failure into a pass. | F-2-2 |
| 27 | 7 | Dataframe execution and report generation run locally. | F-2-2 |
| 28 | 14 | The CLI has no telemetry and does not upload fixtures, reports, or transformation code. | F-2-2 |
| 29 | 9 | The documentation site has no analytics or payment flow. | analytics covered; payment flow F-2-2 |
| 30 | 16 | Its one-click demo uses only a demo: browser-storage key and never reads a real-user storage key. | covered: demo-sandbox |
| 31 | 7 | See the site’s /privacy/ and /terms/ pages. | — |
| 32 | 14 | Run cargo package --manifest-path crates/switchboard/Cargo.toml --locked to check the publishable crate without publishing it. | F-2-2 |
| 33 | 1 | MIT. | — |
| 34 | 2 | See LICENSE. | — |

### Headings and actions

| Copy | Check |
| --- | --- |
| Check a Pandas-to-Polars migration | Clear five-word job headline. |
| Find differences before you migrate | Clear out of context. |
| Check a migration in three steps | Clear out of context. |
| Choose both transformation functions / Run a bounded local fixture / Read the migration decision | Clear verb-led step headings. |
| Run the local migration check / Choose how outputs are compared / Your files stay local | Clear out of context. |
| Try it with sample data / Open the sample report / Copy install / Copy demo command / Read the privacy policy / Read the terms | Result-naming actions. |
| Demo / How it works / Privacy / Terms | Navigation labels; Terms has F-2-4. |

TOML, LazyFrame, Pandas, and Polars are necessary technical identifiers for the stated Python-engineer audience, not marketing jargon. No button uses a generic action such as Submit or Continue.

## Earlier-review and handoff verification

I read review-1.md, polish-1.md, verification-2.md, and the prior handoff. “Fixed” means confirmed live and in current code.

| Earlier finding(s) | Current verification |
| --- | --- |
| F-1-1 | Fixed: clear audience, job headline, and primary sample action at both widths. |
| F-1-2 | Partial; reopened as F-2-1: direct entries exist, but no real CLI recording. |
| F-1-3 | Fixed: direct demo is isolated and Reset preserves real storage. |
| F-1-4 to F-1-6 | Partial; reopened as F-2-2: registry exists, but public claims and dynamic CLI privacy coverage remain incomplete. |
| F-1-7 | Partial; reopened as F-2-1: volatile numbers are gone, but report provenance remains hand-written. |
| F-1-8 | Fixed for the remaining fixture-bound promise; unsupported process wording was removed. |
| F-1-9 | Partial; reopened as F-2-2: binary wording is removed, but local/no-upload is not observed dynamically. |
| F-1-10 to F-1-11 | Fixed: paid checkout and license/offline marketing claims are removed. |
| F-1-12 to F-1-16 | Partial; reopened as F-2-2: current capability, CLI, semantics, build, and privacy statements remain unregistered. |
| F-1-17 | Fixed: paid checkout is not advertised. |
| F-1-18 | Fixed: live unknown route is the product-owned HTTP 404. |
| F-1-19 | Fixed: live root sends restrictive CSP. |
| F-1-20 | Partial; reopened as F-2-3: root/demo metadata is complete; legal/404 social metadata is not. |
| F-1-21 | Fixed: navigation and Back focus the destination H1. |
| F-1-22 | Partial; reopened as F-2-4: chrome is shared but 390px Terms is clipped. |
| F-1-23 to F-1-24 | Fixed: external guide is marked and current live Axe scan is clear. |
| F-1-25 | Regressed; reopened as F-2-4: Terms has a 29px visible target at 390px. |
| F-1-26 to F-1-28 | Fixed: prior long README sentences are split and now under 22 words. |
| F-1-29 to F-1-35 | Fixed: hero/sample/workflow/install/paid/README wording is now clear. |
| F-1-36 | Partial; reopened as F-2-5: streaming-warning wording is consistent, but type/schema is not. |

## What would make this perfect

Ship a generated, self-hosted recording of the real switchboard demo command and test its relationship to the sample report. Remove untestable claims or add complete demo-only behavioural/privacy claim tests. Complete legal/404 metadata, make all four mobile nav targets fully visible, and use one word for the schema/type difference. Then re-run the entire cold-read, storage, route, link, metadata, claim, and history audit from a new clone. Only zero findings merits PASS.
