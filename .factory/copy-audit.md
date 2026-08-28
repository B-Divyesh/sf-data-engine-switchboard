# Copy audit — polish 3

Audited 28 August 2026. Hyphenated terms, command flags, and identifiers count as one word. No sentence exceeds 22 words. No banned marketing word appears.

The first screen says the job in five words, names Python data engineers in 16 words, and presents one primary action. The result note is five words. At 390×844, the action and all three facts remain inside the first viewport.

## Landing sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 16 | For Python data engineers: compare both transforms on one redacted fixture and get a go/no-go report. | Pass |
| 5 | A ready sample report opens. | Pass |
| 16 | A concrete switching plate splits one data route into moss, rubble, and dark aggregate paths. | Pass |
| 9 | The recorded sample shows value, schema, and row-order differences. | Pass |
| 10 | It also shows recorded time, memory, and a streaming warning. | Pass |
| 7 | A value differs in the bundled sample. | Pass |
| 5 | Plan warnings ask for review. | Pass |
| 7 | They do not decide pass or fail. | Pass |
| 10 | Point one TOML file at matching Pandas and Polars functions. | Pass |
| 14 | The command rejects a fixture over its declared limit before it imports your code. | Pass |
| 4 | Measured differences decide the result. | Pass |
| 4 | Streaming warnings remain separate. | Pass |
| 13 | Build it from source, then run the bundled demo in a new temporary directory. | Pass |
| 14 | The command has no telemetry and does not upload fixtures, reports, or transformation code. | Pass |
| 5 | The site has no analytics. | Pass |

Alternate sample text also passes: “A schema differs in the bundled sample.” (7) and “The same rows have a different order in the bundled sample.” (10).

## New legal boundary sentences

| Words | Sentence | Claim evidence |
| ---: | --- | --- |
| 9 | Reports identify each configured fixture and its comparison results. | `@claim:report-scope` |
| 12 | They do not record transformation identity, Python details, or dataframe library versions. | `@claim:report-scope` |
| 8 | The tool runs the transformation code you supply. | `@claim:transformation-file-access` |
| 10 | That code can access files available to its Python process. | `@claim:transformation-file-access` |
| 13 | Switchboard itself does not upload fixture contents, reports, code, filenames, or usage data. | `@claim:cli-local-only` |

The remaining legal sentences range from five to 15 words. They state the MIT license, limits, responsibilities, site data handling, and contact safety plainly.

## README result

All 37 README sentences are 22 words or fewer. The new disclosure, “Your transformation code keeps the file access of its Python process,” is 11 words and maps to `@claim:transformation-file-access`.

## Catalog description

“Check Pandas-to-Polars migrations with bounded local fixtures and JSON go/no-go reports.” is 11 words and 88 characters. It begins with a verb.

## Terminology

| Concept | One term |
| --- | --- |
| Comparison result | measured difference |
| Column/dtype result | schema difference |
| Plan signal | streaming warning |
| Test input | fixture |
| One-click example | bundled sample |
| Recorded interface | terminal recording |
