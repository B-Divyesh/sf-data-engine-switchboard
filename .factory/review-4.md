# Adversarial first-read review 4 — Data Engine Switchboard

Reviewed 28 August 2026 · live https://data-engine-switchboard.sociobot.in/ · commit b35349c114298c275b748c6a6a9466519000caf1

## Verdict: PASS

Zero findings remain.

## Cold first screen

Fresh 390×844 and 1440×900 Chromium contexts, before scrolling:

| Question | Answer | Evidence |
| --- | --- | --- |
| What? | Checks whether a Pandas-to-Polars migration changes output. | “Check a Pandas-to-Polars migration” |
| For whom? | Python data engineers making that decision. | “For Python data engineers…” |
| First click? | Try the sample; a ready report opens. | “Try it with sample data” / “A ready sample report opens.” |

The action and three facts were visible at 390px.

## Copy audit

Hyphenated technical identifiers count as one word. Pandas, Polars, TOML, CSV, Parquet, and LazyFrame are appropriate for the named audience. No sentence exceeded 22 words; no banned marketing word, inconsistent term, unclear heading, or generic action button was found.

### Landing sentences

1. 16 — For Python data engineers: compare both transforms on one redacted fixture and get a go/no-go report.
2. 5 — A ready sample report opens.
3. 16 — A concrete switching plate splits one data route into moss, rubble, and dark aggregate paths. (image alternative)
4. 9 — The recorded sample shows value, schema, and row-order differences.
5. 10 — It also shows recorded time, memory, and a streaming warning.
6. 7 — A value differs in the bundled sample.
7. 5 — Plan warnings ask for review.
8. 7 — They do not decide pass or fail.
9. 10 — Point one TOML file at matching Pandas and Polars functions.
10. 14 — The command rejects a fixture over its declared limit before it imports your code.
11. 4 — Measured differences decide the result.
12. 4 — Streaming warnings remain separate.
13. 13 — Build it from source, then run the bundled demo in a new temporary directory.
14. 14 — The command has no telemetry and does not upload fixtures, reports, or transformation code.
15. 5 — The site has no analytics.

### README sentences

1. 11 — Data Engine Switchboard checks a Pandas-to-Polars migration from the command line.
2. 13 — It is for Python engineers who need evidence before changing a dataframe engine.
3. 9 — It runs matching transforms against a local, redacted fixture.
4. 11 — The report lists value, schema, row-order, time, memory, and streaming warnings.
5. 9 — Install Pandas and Polars, then run the one-command demo.
6. 12 — The command creates a new temporary directory and prints its report path.
7. 9 — The bundled fixture reports value, schema, and row-order differences.
8. 11 — Its exit code is 2 because that sample is a no-go.
9. 10 — The site includes a self-hosted recording of this bundled command.
10. 10 — Runtime and memory values in the recording vary by machine.
11. 5 — Build the CLI from source.
12. 4 — Create a starter assessment.
13. 9 — Edit switchboard.toml to name your module and redacted fixtures.
14. 7 — Each Pandas function returns a Pandas dataframe.
15. 9 — Each Polars function returns a Polars dataframe or LazyFrame.
16. 7 — --json writes the report to standard output.
17. 8 — --output writes the same JSON to a file.
18. 4 — The CLI never prompts.
19. 8 — Fixtures must be regular .csv or .parquet files.
20. 6 — Set max_fixture_mb from 1 to 512.
21. 7 — Paths are resolved from the config file.
22. 10 — It rejects an oversized fixture before importing the transformation module.
23. 7 — Choose strict, compatible, or ignored schema checks.
24. 6 — Choose strict or ignored row order.
25. 11 — Set null, timezone, and float comparison rules in the TOML file.
26. 4 — Measured output differences decide the result.
27. 9 — A streaming warning comes from the Polars execution plan.
28. 13 — It asks for review and cannot turn a measured failure into a pass.
29. 7 — Dataframe execution and report generation run locally.
30. 14 — The CLI has no telemetry and does not upload fixtures, reports, or transformation code.
31. 11 — Your transformation code keeps the file access of its Python process.
32. 9 — The documentation site has no analytics or third-party requests.
33. 16 — Its one-click demo uses only a demo: browser-storage key and never reads a real-user storage key.
34. 7 — See the site’s /privacy/ and /terms/ pages.
35. 14 — Run cargo package --manifest-path crates/switchboard/Cargo.toml --locked to check the publishable crate without publishing it.
36. 1 — MIT.
37. 2 — See LICENSE.

## Demo, claims, and structure

The one-click sample and ?demo=1 both entered /demo/. Its first mobile screen showed a self-hosted real CLI recording: no-go, value/schema/order differences, time and peak-memory evidence, and a separate warning. With a real-storage sentinel, demo wrote only demo:data-engine-switchboard:opened; Reset preserved the sentinel; Start for real removed demo storage; every request was same-origin.

Fresh CLI demo ran in /tmp/data-engine-switchboard-review4-cli-aDTXAK/, created its own child directory with orders.csv, switchboard.toml, transform.py, and switchboard-report.json, and produced three failures plus one warning.

Fresh clone /tmp/data-engine-switchboard-review4-clean-nJTSeb: npm ci completed without audit vulnerabilities. All claims passed: demo-sandbox; recorded-cli-demo; report-evidence; report-scope; cli-output-contract; comparison-policy; fixture-bound-before-import; cli-local-only; transformation-file-access; site-no-analytics; route-metadata. npm run build passed. No landing or README claim was unlisted.

Live /, /demo/, /privacy/, /terms/, and /404.html had expected per-route titles, one H1/main, descriptions, canonical, OG/Twitter, favicon, and Apple icon. Unknown route returned designed HTTP 404. Navigation and Back focused H1. Shared chrome, privacy/terms, Param Factory credit, build label, CSP/HSTS/nosniff/referrer/permissions headers, and no dead links passed. At 390px each nav target was 97.5×51px with no overflow. Axe reported zero violations on all five routes. The concrete/moss system follows .factory/design.md and is not generic. AI is not missed leverage for this deterministic local-comparison brief; no AI feature or key exists.

## Earlier findings

Every earlier review, polish record, verification note, and handoff was read and confirmed against live behavior and current code/tests. F-1-1 through F-1-36 are fixed: clear first read; real isolated demo; complete tested claims; report recording/evidence; bounds and local privacy; no paid/license flow; designed 404/CSP/metadata; focused shared routes; accessible mobile navigation; plain, consistent copy. F-2-1 through F-2-5 are fixed: real recording, observable claims, complete metadata, full mobile header, and schema terminology. F-3-1 and F-3-2 are fixed: Terms states report scope and Privacy states transformation-process file access; their dedicated claims exercise both boundaries.

## What would make this perfect

No further product change is identified. Retain the clean-clone claim and live-route checks in the release gate.
