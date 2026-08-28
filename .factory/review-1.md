# Adversarial first-read review 1 — Data Engine Switchboard

Reviewed: 28 August 2026

Live URL: <https://data-engine-switchboard.sociobot.in/>

Repository candidate: `af81ae87e6baa63bef8e963c905953d9a7aff46f`

Verdict: **FAIL**

There are blocking and minor findings, and no claim has a registered claim test. The passing
general test suite does not change this verdict.

## 1. Cold first screen

Fresh Chromium contexts were opened at 390×844 and 1440×900 without scrolling.

| Question | First-read answer |
| --- | --- |
| What does this do? | It appears to run a Pandas and a Polars transformation on the same redacted fixture and compare output, speed, memory, and streaming behavior. |
| For whom? | Cannot be answered from the first screen. “Local migration rig” implies a technical user, but no role or situation is named. |
| What should I click first? | Cannot be answered. “Install the CLI” and “Inspect the seeded proof” compete, and neither starts the required sample-data trial. |

The exact first-screen text that fails is: “Switch engines. Keep the truth.”, “Local migration
rig”, “Install the CLI”, and “Inspect the seeded proof”. The 22-word supporting paragraph says
what is compared but not who needs it. This is blocking at both viewports.

## 2. Findings

### Blocking

#### F-1-1 — The first screen does not identify the user or a clear first action

- Exact location/quote: landing hero, “Switch engines. Keep the truth.”; “Local migration rig”; buttons “Install the CLI” and “Inspect the seeded proof”.
- Why this fails: the headline is a metaphor, the intended Python data engineer is absent, and two setup/proof actions compete. A cold visitor cannot answer two of the three mandatory questions.
- Concrete fix: use `Check a Pandas-to-Polars migration` as the headline; use `For Python data engineers: compare both transforms on one redacted fixture and get a go/no-go report.` as the supporting sentence; make `Try it with sample data` the primary action and state beside it that a ready report opens.

#### F-1-2 — There is no one-click or CLI demo

- Exact location/evidence: no “Try it with sample data” action; `GET /demo` returns the Azure 404; `/?demo=1` renders the ordinary landing page; `.factory/demo.md` is absent; `switchboard demo` in `/tmp/des-cli-demo-Om365t` exits 2 with `error: unrecognized subcommand 'demo'`.
- Why this fails: a visitor must install dependencies and configure files before trying the real job. The clickable report is a hard-coded recording, not the CLI operating on bundled sample input.
- Concrete fix: ship `switchboard demo` (or `--demo`) with the realistic checked-in fixture, execute it in a new temporary directory, print the output location, add a self-hosted recording of that exact run, document it in `.factory/demo.md`, and link it from a first-screen `Try it with sample data` action.

#### F-1-3 — The nominal demo URL reads and writes real-user storage

- Exact location/evidence: in a fresh context with `sb_license:data-engine-switchboard=real-user-token`, opening `/?demo=1` populated the real license field, called `https://api.sociobot.in/.../verify?license=real-user-token`, and wrote `sb_license:data-engine-switchboard:verdict`. It showed no “Demo — sample data, nothing is saved” banner, Reset, or Start for real action.
- Why this fails: the expected direct demo entry point is not isolated and touches the real storage namespace. There is no way to verify that demo actions leave real data untouched.
- Concrete fix: make `/demo` or `?demo=1` a real mode using only a `demo:` namespace or memory; never read `sb_license:*`; block production API calls; add the persistent banner, `Reset demo`, and `Start for real`; test a sentinel real-data key before and after the complete flow.

#### F-1-4 — The claim registry and claim tests do not exist

- Exact location: `.factory/claims.json` is missing; `rg '@claim:'` finds no tagged tests.
- Why this fails: there were zero listed claim commands to run, so every claim below is untested under the required clean demo sandbox. `npm test` passing is not equivalent to one observable test per claim.
- Concrete fix: create `.factory/claims.json`; give every claim exactly one `@claim:<id>` test; run those tests only through the demo entry point in a fresh context/temp directory. Remove any claim that cannot be tested.

#### F-1-5 — Landing comparison and output claims are unlisted

- Exact quotes: “Run both transformations on the same redacted fixture.”; “Get one go/no-go report for values, schema, row order, time, memory, and streaming-plan risk.”
- Why this fails: visitors can rely on both statements, but neither has a claim entry or end-to-end demo test.
- Concrete fix: add separate claim tests that execute the bundled Pandas and Polars transforms and assert value, schema, order, runtime, memory, and streaming fields in the resulting report.

#### F-1-6 — Landing privacy and bounds claims are unlisted

- Exact quotes: “Local only”; “Bounded fixtures”; “No telemetry”.
- Why this fails: these are prominent trust claims with no network-interception, oversize-fixture, or telemetry test.
- Concrete fix: register and test all three. Intercept the whole demo flow and allow only documented same-origin requests; assert an oversized fixture is rejected before execution.

#### F-1-7 — The recorded report’s behavior and numbers are unlisted claims

- Exact quotes/location: “The live, keyboard-operable report shows the evidence the CLI returns.”; “Measured failures and plan heuristics never share a label.”; `Rows 3 / 3`; `Runtime 14.2 / 3.8 ms`; `Peak RSS 84 / 42 MB`; `Streaming applied`; “Values differ at row 1, column 2.”; “No plan markers detected.”
- Why this fails: the report is populated from `site/src/demo.ts`, not generated by the displayed run. The precise time, memory, streaming, row, and finding values have no provenance or quantitative test.
- Concrete fix: generate the recording from a reproducible demo run and test each displayed field against its artifact, or remove the numbers and label the view explicitly as an illustrative example.

#### F-1-8 — Landing execution claims are unlisted

- Exact quotes: “Each engine gets an isolated Python process.”; “Fixture size is enforced before either import or transformation runs.”; “Review measured parity and benchmark samples separately from version-sensitive explain-plan heuristics.”
- Why this fails: process isolation, enforcement order, and report separation are observable product promises without registered tests.
- Concrete fix: add tests that record distinct process IDs, use an import side effect to prove an oversized fixture fails before import, and assert measured and heuristic fields remain structurally separate.

#### F-1-9 — Landing binary and local-data claims are unlisted

- Exact quotes: “The binary embeds its Python bridge.”; “Your data and transformations stay where they are.”
- Why this fails: these are packaging and privacy promises without a packaged-binary test or network/file-boundary test.
- Concrete fix: install the packed crate in a clean consumer, run it without repository source files, intercept networking, and assert fixtures are neither copied outside the temp assessment nor transmitted.

#### F-1-10 — Paid-product claims are unlisted

- Exact quotes: “The core assessor, JSON export, and every safety check are MIT-licensed.”; “A $29 one-time Field Kit unlocks CI policy presets, a representative-fixture matrix, rollout checkpoints, and a printable migration review.”; “Refunds are handled there and revoke the license automatically.”
- Why this fails: license scope, price, delivered contents, and revocation behavior are purchase decisions. None has a claim entry; the checkout is also broken in F-1-17.
- Concrete fix: register license/file checks and a Sociobot sandbox checkout/refund flow that asserts the exact price, delivered files, and revoked access. Do not advertise the tier until the endpoint works.

#### F-1-11 — License and offline landing claims are unlisted

- Exact quotes: “Verification contacts only the Sociobot license endpoint.”; “Free CLI active.”; “No license stored.”; “The cached docs and free demo still work.”; dynamic messages that claim a previously valid cached verification remains active.
- Why this fails: privacy, storage, entitlement, and offline behavior lack claim entries. The “free demo” portion is false because no demo exists.
- Concrete fix: add network/storage/offline claim tests, split docs-shell behavior from CLI behavior, and remove “free demo still work” until a cached demo really exists.

#### F-1-12 — README product and installation claims are unlisted

- Exact quotes: the two opening paragraphs; “Download a release binary for your platform”; the Python 3.10+ requirement; “Each function receives the dataframe loaded for its engine and returns a dataframe or, for Polars, a `LazyFrame`.”
- Why this fails: these define capability, privacy, availability, and compatibility. There are no claim entries, and the handoff says only the current Linux target is built, contradicting “for your platform”.
- Concrete fix: register clean-consumer tests for each supported platform/runtime and transformation contract. Replace the download sentence with `Build the CLI from source:` until actual platform releases exist.

#### F-1-13 — README CLI, exit-code, bounds, and privacy claims are unlisted

- Exact quotes: the `--json`, `--output`, and `--ci` behavior sentences; “Exit codes are part of the public interface”; all three exit-code table meanings; path resolution; the `.csv`/`.parquet` and `1..=512` bounds; “Input remains on the machine running the command.”; “There is no telemetry.”
- Why this fails: these are public behavioral and privacy contracts without tagged tests in the claims registry.
- Concrete fix: add one observable claim test per behavior, including stdout/file byte equality, prompt absence, every exit status, relative paths, type/size rejection, and intercepted networking.

#### F-1-14 — README runner and comparison claims are unlisted

- Exact quotes: all four sentences under “Python transformation contract”; all five bullets under “Comparison semantics”; both sentences describing `measured` and `heuristics`.
- Why this fails: engine loading, streaming collection, memory definition, and comparison policies materially affect a migration decision but are not claim-tested.
- Concrete fix: register fixture-based tests for CSV, Parquet, LazyFrame streaming, peak-process memory shape, every schema/order/null/timezone/float mode, and the measured-versus-heuristic decision boundary.

#### F-1-15 — README seeded-proof and build claims are unlisted

- Exact quotes: all three sentences under “Seeded proof”; “`npm test` runs Rust formatting/lints/tests and the site checks.”; “`npm run build` creates the release binary under `dist/bin/` and the deployable landing/docs site under `dist/site/`.”; “Create a registry-ready Rust package without publishing”.
- Why this fails: the sample outcome and build artifacts are reliance-worthy claims. The general suite passes, but none is registered or run as a claim test from the required demo sandbox.
- Concrete fix: add tagged tests for the three seeded differences, exit 2, site recording parity, test stages, exact build outputs, and `cargo package` contents.

#### F-1-16 — README privacy and license-flow claims are unlisted

- Exact quotes: “All dataframe execution and report generation is local.”; “Only the optional website license verifier contacts Sociobot after a user supplies or receives a purchase token.”
- Why this fails: these are high-value privacy claims. The fresh landing made same-origin requests only, but no registered test covers the CLI plus the entire license/demo flow.
- Concrete fix: add a full-flow interception test and a CLI network-denial test. Explicitly enumerate the allowed Sociobot request only after a deliberate real-mode license action.

#### F-1-17 — The paid checkout link is dead

- Exact location/evidence: landing `Buy the $29 Field Kit` → `https://api.sociobot.in/api/v1/products/data-engine-switchboard/checkout`; following redirects returns HTTP 404.
- Why this fails: the site offers a paid product that cannot be bought. This also confirms the prior handoff gap: “The factory still needs to register the production paid product/return URL.”
- Concrete fix: register the product and return URL through the Sociobot billing API, add a sandbox/live route health test, or remove the paid section until it is available.

#### F-1-18 — Unknown routes use a generic hosting-provider 404

- Exact location/evidence: `/missing-review-route` and `/demo` return `Azure Static Web Apps - 404: Not found`, with no product header, `<main>`, `<h1>`, or route home.
- Why this fails: routing leaves the product’s visual system and provides no designed recovery. `/demo` also breaks a required deep link.
- Concrete fix: add a product-styled `/404.html` with `404 — Data Engine Switchboard`, one H1, the normal header/footer, and actions back home and to the demo; configure the host to use it while preserving HTTP 404.

#### F-1-19 — The earlier CSP finding is still unfixed

- Exact prior location: `.factory/verification-2.md`, “Low: the live response does not send a `Content-Security-Policy` header.” The earlier document assigned no reusable finding ID, so this review reissues it as F-1-19.
- Current evidence: root response headers still contain no CSP; `site/public/staticwebapp.config.json` also defines none.
- Why this fails: the history rule makes any unfixed earlier finding blocking, regardless of its former severity.
- Concrete fix: add and deploy a CSP that permits the actual same-origin scripts/styles/images and the explicit Sociobot connection only, then test the live header and console.

### Minor

#### F-1-20 — Canonical, social, and Apple icon metadata are missing

- Exact location: `/`, `/privacy/`, and `/terms/` have no canonical link, Open Graph tags, Twitter card tags, or 180px Apple touch icon. Only `/favicon.svg` exists.
- Why this matters: shared links lack product-controlled identity and crawlers have no canonical URL.
- Concrete fix: add per-route canonical URLs, OG/Twitter title and description, the required original 1200×630 image, and a 180×180 Apple touch icon. Add metadata assertions for every route.

#### F-1-21 — Route changes do not move focus to the new H1

- Exact evidence: after clicking Privacy, `document.activeElement` is `BODY`; it remains `BODY` after Back. Browser history restored the prior landing scroll position correctly.
- Why this matters: screen-reader and keyboard users receive no route-change focus or announcement.
- Concrete fix: on navigation, focus a programmatically focusable H1 and announce its title; test forward/back focus and restored scroll.

#### F-1-22 — Header and footer are not consistent across routes

- Exact location: landing header has Proof/Install/License/Source, privacy has Product/Terms, and terms has Product/Privacy. Landing footer has no Privacy, Terms, “Built by Param Factory”, or build ID; legal footers omit most of the required set.
- Why this matters: navigation and product provenance change by route.
- Concrete fix: render one shared header/footer on every normal and 404 route, with wordmark, Demo, Privacy, Terms, product one-liner, factory credit, version, and build ID.

#### F-1-23 — External links do not identify themselves as external

- Exact locations: header “Source”, “Read the full CLI contract”, and the checkout link lead to other origins without visible or accessible external-link wording.
- Why this matters: visitors are moved to GitHub or Sociobot without warning.
- Concrete fix: append visible “(external)” text or an icon with accessible text to each external link.

#### F-1-24 — The report panel uses an invalid ARIA role/element combination

- Exact location/evidence: `article#case-panel[role=tabpanel]`; live Axe 4.10 reports `aria-allowed-role` at desktop and phone sizes.
- Why this matters: the semantics can be interpreted inconsistently by assistive technology.
- Concrete fix: use a `<div role="tabpanel">` or another element on which `tabpanel` is allowed, then require zero Axe violations rather than filtering to serious/critical.

#### F-1-25 — Three mobile link targets are shorter than 44px

- Exact location/evidence at 390px: “Read the full CLI contract” is 249×19px, Privacy is 47×20px, and Terms is 38×20px.
- Why this matters: the links miss the stated 44px touch-target baseline.
- Concrete fix: add block/inline-flex padding or a 44px minimum height/width without shrinking the visible focus treatment.

#### F-1-26 — README opening capability sentence exceeds 22 words

- Exact quote/count: “It runs declared Pandas and Polars transformations against the same redacted CSV or Parquet fixtures, then reports output parity, schema and row-order changes, sampled runtime and peak process memory, plus clearly labelled streaming-plan heuristics.” — 34 words.
- Why this matters: it combines input, execution, comparison, performance, and heuristic concepts in one sentence.
- Concrete rewrite: `It runs the same redacted CSV or Parquet fixture through Pandas and Polars. It reports value, type, order, time, memory, and streaming differences.`

#### F-1-27 — README fixture-limit sentence exceeds 22 words

- Exact quote/count: “Every fixture must be a regular `.csv` or `.parquet` file and no larger than `max_fixture_mb`; the setting is required to be in `1..=512`.” — 23 words.
- Why this matters: file rules and configuration bounds are compressed together.
- Concrete rewrite: `Fixtures must be regular .csv or .parquet files. Set max_fixture_mb from 1 to 512.`

#### F-1-28 — README heuristic sentence exceeds 22 words

- Exact quote/count: “Its **heuristics** section is derived from Polars explain-plan text and always includes the matching rule and caveat; a heuristic can request review but cannot turn measured parity into a pass.” — 30 words.
- Why this matters: origin, disclosure, review behavior, and decision behavior compete in one sentence.
- Concrete rewrite: `The heuristics section lists each Polars plan match and caveat. Heuristics can request review, but they cannot change a measured failure to a pass.`

#### F-1-29 — Hero copy uses a control-room metaphor instead of the job

- Exact quotes: “Local migration rig”; “Switch engines. Keep the truth.”
- Why this matters: “rig” and “truth” require interpretation and do not name the Python/Pandas-to-Polars decision in the headline.
- Concrete rewrite: `Compare Pandas and Polars locally` and `Check a Pandas-to-Polars migration`.

#### F-1-30 — The proof section mixes unexplained metaphors and jargon

- Exact quotes: “Seeded run / 003 faults”; “Inspect the seeded proof”; “Choose a circuit.”; “See what ‘almost identical’ hides.”
- Why this matters: “seeded”, “faults”, “proof”, and “circuit” describe the visual theme rather than the visitor’s task. The button is a verb but does not name a clear result.
- Concrete rewrite: `Sample run: three differences`; `Try it with sample data`; `Choose a sample difference`; `Find output differences before you migrate`.

#### F-1-31 — Workflow headings do not make sense out of context

- Exact quotes: “A migration gate, not another notebook.”; “Declare both paths”; “Make the call”.
- Why this matters: a headings list does not reveal what is gated, what the paths are, or what call is made.
- Concrete rewrite: `Check a migration in three steps`; `Choose both transformation functions`; `Read the go/no-go report`.

#### F-1-32 — Install headings use metaphor and undefined terms

- Exact quotes: “Bolt it into your repo.”; “Dial the semantics that matter”; `Peak RSS`; “Python bridge”.
- Why this matters: first-time visitors must translate the switchboard metaphor and unexplained implementation terms.
- Concrete rewrite: `Install the CLI in your project`; `Choose how outputs are compared`; `Peak process memory`; `embedded Python runner`.

#### F-1-33 — Paid-tier naming is vague and inconsistently capitalized

- Exact quotes: “Field kit / one-time”, “Field Kit”, “Upgrade the playbook”, “representative-fixture matrix”.
- Why this matters: “kit”, “playbook”, and “matrix” do not state the downloadable contents, and “Field kit”/“Field Kit” is inconsistent.
- Concrete rewrite: use `Migration guides` everywhere; heading `Add the $29 migration guides`; list the exact files: `CI policy file, fixture checklist, rollout checklist, and printable review`.

#### F-1-34 — README introduction is dense with unexplained jargon

- Exact quotes: “local-first migration assessment CLI”, “data-product engineers”, “output parity”, “peak process memory”, “streaming-plan heuristics”.
- Why this matters: the first paragraph makes the reader decode product category and implementation language before learning the job.
- Concrete rewrite: `Data Engine Switchboard is a command-line check for Python engineers moving a workload from Pandas to Polars. It compares matching outputs, run time, process memory, and warnings from the Polars execution plan.`

#### F-1-35 — README headings “Comparison semantics” and “Seeded proof” are not plain out of context

- Exact location: README headings.
- Why this matters: neither says what the reader can do in that section.
- Concrete rewrite: `Choose how outputs are compared` and `Run the sample assessment`.

#### F-1-36 — One concept uses several terms

- Exact locations: landing “streaming-plan risk” and “plan heuristics”; README “streaming-plan heuristics”, “Explain-plan flags”, and “heuristics”.
- Why this matters: a visitor cannot tell whether risk, a plan flag, and a heuristic are the same output.
- Concrete fix: choose `streaming warning` for the user-facing concept everywhere; define once that it comes from the Polars execution plan and does not determine pass/fail.

No banned marketing adjective from the attached plain-words list was found. The remaining
buttons (`Install`, `Copy`, `Buy`, `Verify`, and `Download`) name their immediate result; the
sample action in F-1-30 is the exception.

## 3. Claim-test and sandbox results

| Check | Result | Evidence |
| --- | --- | --- |
| Read `.factory/claims.json` | **BLOCKED/FAIL** | File does not exist. |
| Run every listed claim test | **0 listed, 0 run** | No claim can be accepted as tested. |
| Clean-clone general suite | PASS, but not claim evidence | Clone `/tmp/des-review-clone-a3Im5Y` at `af81ae8`; `npm test`: 7 Rust, 2 Vitest, 6 Playwright passed. |
| CLI demo in temp directory | **FAIL** | `switchboard demo` exits 2 as an unknown subcommand. |
| Direct web demo | **FAIL** | `/demo` is 404; `?demo=1` is the ordinary page. |
| Demo namespace | **FAIL** | `?demo=1` reads `sb_license:*`, writes its verdict, and calls the production verifier. |
| Demo banner/reset/start | **FAIL** | All three controls are absent. |
| Offline exercise | Partial pass | After a warm load, offline reload retained title/main and showed the offline notice. There is no real demo to exercise offline. |
| Network interception | Partial pass | Fresh landing startup was same-origin only. A stored real license caused the expected Sociobot request even under `?demo=1`, proving lack of isolation. |

## 4. Structure, links, and accessibility results

| Check | Result |
| --- | --- |
| Root title | PASS: `Data Engine Switchboard — verify Pandas to Polars migrations`, exactly 60 characters. |
| Legal titles | PASS: `Privacy — Data Engine Switchboard`; `Terms — Data Engine Switchboard`. |
| `lang`, one H1, one main on normal routes | PASS. |
| Root H1 is the plain job | **FAIL**, F-1-1/F-1-29. |
| Meta description | PASS on the three normal routes. |
| Canonical/OG/Twitter/Apple icon | **FAIL**, F-1-20. |
| Favicon | PASS: SVG favicon loads. |
| Designed 404 | **FAIL**, F-1-18. |
| `/`, `/privacy/`, `/terms/` deep links | PASS. |
| `/demo` deep link | **FAIL**, F-1-2/F-1-18. |
| Back button/scroll | PASS: prior landing scroll position restored. |
| Route-change focus/announcement | **FAIL**, F-1-21. |
| Internal anchor targets | PASS: Proof, Install, and License targets exist. |
| Link crawl | **FAIL**: checkout returns 404; other crawled internal/GitHub links return 200. |
| Header/footer consistency | **FAIL**, F-1-22. |
| Visual identity | PASS: the concrete switch-room/moss palette, hard borders, narrow stencil-like type, and original plate image are distinct rather than a generic SaaS card/gradient layout. |
| Mobile horizontal overflow | PASS. |
| Console/page errors | PASS at both reviewed sizes. |
| `/opt/fleet/lib/verify-url.sh` | PASS after supplying its required evidence directory; output is under `/tmp/des-review-evidence`. |
| Live Axe scan | **FAIL**: no serious/critical issues, but one minor `aria-allowed-role` issue remains at both sizes (F-1-24). Zero findings are required. |
| 44px touch targets | **FAIL**, F-1-25. |
| Initial JavaScript | PASS: 6,389 bytes raw / 3,075 bytes gzip. |
| CSP | **FAIL**, F-1-19. |

## 5. History verification

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The earlier
`.factory/handoff.md` and `.factory/verification-2.md` were read in full.

| Earlier item | Live/code verification | Result |
| --- | --- | --- |
| Verification-2 low defect: missing CSP | Header and config still omit CSP. | **Unfixed; BLOCKING again as F-1-19.** |
| Handoff known gap: paid product/return URL still needed | Live checkout returns 404. | **Unfixed and user-visible; BLOCKING as F-1-17.** |
| Handoff claims for title/lang/main/alt/no console errors | Rechecked live at desktop and 390px. | Confirmed. |
| Handoff claim for warm offline shell | Rechecked with browser offline mode. | Confirmed for docs shell only. |
| Handoff claim for same-origin startup | Rechecked with request interception. | Confirmed before a license token is present. |
| Handoff claim for responsive distinct art | Rechecked at both sizes and against `.factory/design.md`. | Confirmed. |

## 6. Complete copy audit

Counts treat a hyphenated term or code identifier as one word. Commands and table fragments are
not sentences. Headings and action labels are audited after the sentence tables.

### Landing-page sentences

| # | Words | Sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 2 | Switch engines. | F-1-1, F-1-29 |
| 2 | 3 | Keep the truth. | F-1-1, F-1-29 |
| 3 | 8 | Run both transformations on the same redacted fixture. | F-1-5 |
| 4 | 14 | Get one go/no-go report for values, schema, row order, time, memory, and streaming-plan risk. | F-1-5, F-1-36 |
| 5 | 5 | See what “almost identical” hides. | F-1-30 |
| 6 | 3 | Choose a circuit. | F-1-30 |
| 7 | 10 | The live, keyboard-operable report shows the evidence the CLI returns. | F-1-7 |
| 8 | 9 | Measured failures and plan heuristics never share a label. | F-1-7, F-1-36 |
| 9 | 7 | Values differ at row 1, column 2. | F-1-7 |
| 10 | 4 | No plan markers detected. | F-1-7 |
| 11 | 7 | This does not prove every operator streamed. | — |
| 12 | 6 | A migration gate, not another notebook. | F-1-31 |
| 13 | 17 | Point a small TOML file at your Pandas and Polars functions plus representative CSV or Parquet fixtures. | — |
| 14 | 7 | Each engine gets an isolated Python process. | F-1-8 |
| 15 | 10 | Fixture size is enforced before either import or transformation runs. | F-1-8 |
| 16 | 11 | Review measured parity and benchmark samples separately from version-sensitive explain-plan heuristics. | F-1-8, F-1-36 |
| 17 | 5 | Bolt it into your repo. | F-1-32 |
| 18 | 6 | The binary embeds its Python bridge. | F-1-9, F-1-32 |
| 19 | 8 | Your data and transformations stay where they are. | F-1-9 |
| 20 | 5 | Keep the CLI free. | F-1-33 |
| 21 | 3 | Upgrade the playbook. | F-1-33 |
| 22 | 11 | The core assessor, JSON export, and every safety check are MIT-licensed. | F-1-10 |
| 23 | 19 | A $29 one-time Field Kit unlocks CI policy presets, a representative-fixture matrix, rollout checkpoints, and a printable migration review. | F-1-10, F-1-33 |
| 24 | 6 | Sociobot/Dodo is the merchant of record. | F-1-10 |
| 25 | 9 | Refunds are handled there and revoke the license automatically. | F-1-10 |
| 26 | 7 | Verification contacts only the Sociobot license endpoint. | F-1-11 |
| 27 | 3 | Free CLI active. | F-1-11 |
| 28 | 3 | No license stored. | F-1-11 |
| 29 | 2 | Measure first. | — |
| 30 | 2 | Migrate second. | — |
| 31 | 2 | You’re offline. | — |
| 32 | 8 | The cached docs and free demo still work. | F-1-11 |

Reachable dynamic messages are also copy:

| Words | Sentence | Flag |
| ---: | --- | --- |
| 6 | Field Kit unlocked from this device. | F-1-11, F-1-33 |
| 4 | License no longer active. | — |
| 6 | The free CLI remains available. | F-1-11 |
| 3 | Field Kit unlocked. | F-1-33 |
| 2 | Rechecking quietly… | — |
| 2 | Checking license… | — |
| 2 | License verified. | — |
| 7 | You can keep using the free CLI. | F-1-11 |
| 3 | Offline verification skipped. | F-1-11 |
| 9 | Field Kit remains unlocked from the last valid check. | F-1-11, F-1-33 |
| 5 | Could not verify right now. | — |
| 8 | Check your connection; the free CLI still works. | F-1-11 |
| 10 | Paste the license token from your receipt, then verify again. | — |
| 8 | Clipboard access is unavailable; select the command text. | — |

### README sentences

| # | Words | Sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 13 | Data Engine Switchboard is a local-first migration assessment CLI for Python data-product engineers. | F-1-12, F-1-34 |
| 2 | 34 | It runs declared Pandas and Polars transformations against the same redacted CSV or Parquet fixtures, then reports output parity, schema and row-order changes, sampled runtime and peak process memory, plus clearly labelled streaming-plan heuristics. | F-1-12, F-1-26, F-1-34, F-1-36 |
| 3 | 16 | It does not translate dataframe code, upload data, or pretend a small fixture proves production safety. | F-1-12 |
| 4 | 9 | It makes the evidence for a migration decision repeatable. | F-1-12 |
| 5 | 11 | Download a release binary for your platform, or build from source: | F-1-12 |
| 6 | 21 | The CLI is versioned from `0.1.0` and requires Python 3.10+ with the libraries used by your transformation module. | F-1-12 |
| 7 | 4 | For the included example: | — |
| 8 | 8 | Create a starter assessment in the current directory: | — |
| 9 | 16 | Edit `switchboard.toml` to point at a Python module and one or more bounded, redacted fixtures. | — |
| 10 | 18 | Each function receives the dataframe loaded for its engine and returns a dataframe or, for Polars, a `LazyFrame`. | F-1-12 |
| 11 | 4 | Run the decision report: | — |
| 12 | 10 | Write a durable JSON report for CI or further analysis: | — |
| 13 | 6 | `--json` writes only JSON to stdout. | F-1-13 |
| 14 | 16 | `--output` writes the same report to a file while preserving terminal output unless `--json` is set. | F-1-13 |
| 15 | 12 | `--ci` disables decoration and makes execution errors terse; the CLI never prompts. | F-1-13 |
| 16 | 8 | Exit codes are part of the public interface: | F-1-13 |
| 17 | 8 | Paths are resolved relative to the config file. | F-1-13 |
| 18 | 23 | Every fixture must be a regular `.csv` or `.parquet` file and no larger than `max_fixture_mb`; the setting is required to be in `1..=512`. | F-1-13, F-1-27 |
| 19 | 8 | Input remains on the machine running the command. | F-1-13 |
| 20 | 4 | There is no telemetry. | F-1-13 |
| 21 | 11 | The embedded runner imports this module separately for each engine/sample. | F-1-14 |
| 22 | 14 | CSVs use `pandas.read_csv` and `polars.scan_csv`; Parquet uses `pandas.read_parquet` and `polars.scan_parquet`. | F-1-14 |
| 23 | 13 | A returned Polars `LazyFrame` is collected with the requested streaming engine when supported. | F-1-14 |
| 24 | 15 | Peak memory is the Python process maximum resident set size, not a per-operation allocation count. | F-1-14 |
| 25 | 20 | `schema`: `strict` compares reported dtype names; `compatible` groups numeric, temporal, string, boolean and null families; `ignore` checks column names only. | F-1-14 |
| 26 | 13 | `order`: `strict` compares rows in emitted order; `ignore` performs a deterministic multiset comparison. | F-1-14 |
| 27 | 12 | `nulls`: `strict` distinguishes null from IEEE NaN; `nan_equal` treats either as missing. | F-1-14 |
| 28 | 21 | `timezone`: `strict` compares offsets as emitted; `utc` compares instants after UTC normalization; `ignore` removes timezone offsets while retaining local wall time. | F-1-14 |
| 29 | 13 | `float_abs` and `float_rel` use `abs(a-b) <= abs_tol + rel_tol * max(abs(a), abs(b))`. | F-1-14 |
| 30 | 11 | The report’s **measured** section contains values observed from the runs. | F-1-14 |
| 31 | 30 | Its **heuristics** section is derived from Polars explain-plan text and always includes the matching rule and caveat; a heuristic can request review but cannot turn measured parity into a pass. | F-1-14, F-1-28, F-1-36 |
| 32 | 15 | The checked-in suite intentionally introduces one value mismatch, one schema mismatch, and one order mismatch: | F-1-15 |
| 33 | 11 | It should return exit code `2` and report all three cases. | F-1-15 |
| 34 | 16 | This example is covered by comparator tests and is the recorded scenario on the product site. | F-1-15 |
| 35 | 9 | `npm test` runs Rust formatting/lints/tests and the site checks. | F-1-15 |
| 36 | 21 | `npm run build` creates the release binary under `dist/bin/` and the deployable landing/docs site under `dist/site/` (with `index.html` at that root). | F-1-15 |
| 37 | 5 | To work on one part: | — |
| 38 | 7 | Create a registry-ready Rust package without publishing: | F-1-15 |
| 39 | 8 | All dataframe execution and report generation is local. | F-1-16 |
| 40 | 17 | Only the optional website license verifier contacts Sociobot after a user supplies or receives a purchase token. | F-1-16 |
| 41 | 11 | Read the site’s `/privacy/` and `/terms/` pages for that flow. | — |
| 42 | 13 | Always use representative, redacted fixtures and validate a migration again under production-like load. | — |
| 43 | 1 | MIT. | — |
| 44 | 2 | See [LICENSE](LICENSE). | — |

The exit-code table fragments are also claims and are covered by F-1-13. No README sentence
other than F-1-26, F-1-27, and F-1-28 exceeds 22 words.

### Landing headings and action labels

| Copy | Words | Result |
| --- | ---: | --- |
| Switch engines. Keep the truth. | 5 | Flag F-1-1/F-1-29. |
| See what “almost identical” hides. | 5 | Flag F-1-30. |
| A migration gate, not another notebook. | 6 | Flag F-1-31. |
| Declare both paths | 3 | Flag F-1-31. |
| Run locally | 2 | Clear. |
| Make the call | 3 | Flag F-1-31. |
| Bolt it into your repo. | 5 | Flag F-1-32. |
| Dial the semantics that matter | 5 | Flag F-1-32. |
| Keep the CLI free. Upgrade the playbook. | 7 | Flag F-1-33. |
| Install the CLI | 3 | Clear result-naming verb, but not the required sample-first action. |
| Inspect the seeded proof | 4 | Flag F-1-30. |
| Value drift / Schema drift / Order drift | 2 each | Clear tab labels, not command buttons. |
| Copy install / Copy run | 2 each | Clear result-naming verbs. |
| Buy the $29 Field Kit | 5 | Clear verb; destination is broken (F-1-17). |
| Verify license | 2 | Clear result-naming verb. |
| Download the Field Kit | 4 | Clear result-naming verb. |

## 7. What would make this perfect

Resolve every finding above, then rerun the review from a fresh clone and browser context. A
perfect round has a one-click isolated demo backed by the real CLI, a complete passing claim
registry, a working or removed paid tier, product-owned 404/routing/metadata, zero Axe and touch
target findings, and plain copy with no flagged sentence, heading, button, or inconsistent term.
There is no PASS-adjacent exception: after those changes, the full crawl, offline interception,
storage sentinel, claim suite, copy audit, mobile/desktop first read, and history audit must return
zero findings.
