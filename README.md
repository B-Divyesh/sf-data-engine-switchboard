# Data Engine Switchboard

Data Engine Switchboard is a local-first migration assessment CLI for Python data-product engineers. It runs declared Pandas and Polars transformations against the same redacted CSV or Parquet fixtures, then reports output parity, schema and row-order changes, sampled runtime and peak process memory, plus clearly labelled streaming-plan heuristics.

It does not translate dataframe code, upload data, or pretend a small fixture proves production safety. It makes the evidence for a migration decision repeatable.

## Install

Download a release binary for your platform, or build from source:

```sh
cargo install --path crates/switchboard
switchboard --help
```

The CLI is versioned from `0.1.0` and requires Python 3.10+ with the libraries used by your transformation module. For the included example:

```sh
python3 -m pip install -r examples/seeded/requirements.txt
```

## Usage

Create a starter assessment in the current directory:

```sh
switchboard init
```

Edit `switchboard.toml` to point at a Python module and one or more bounded, redacted fixtures. Each function receives the dataframe loaded for its engine and returns a dataframe or, for Polars, a `LazyFrame`.

```toml
version = 1
python = "python3"
module = "transform.py"
samples = 3
max_fixture_mb = 25

[comparison]
schema = "compatible"
order = "strict"
nulls = "nan_equal"
timezone = "utc"
float_abs = 1e-9
float_rel = 1e-7

[[case]]
name = "clean orders"
fixture = "fixtures/orders.csv"
pandas = "clean_pandas"
polars = "clean_polars"
streaming = true
```

Run the decision report:

```sh
switchboard assess switchboard.toml
```

Write a durable JSON report for CI or further analysis:

```sh
switchboard assess switchboard.toml --json --output switchboard-report.json
```

`--json` writes only JSON to stdout. `--output` writes the same report to a file while preserving terminal output unless `--json` is set. `--ci` disables decoration and makes execution errors terse; the CLI never prompts.

Exit codes are part of the public interface:

| Code | Meaning |
| ---: | --- |
| `0` | GO: every case passed the configured parity checks |
| `2` | NO-GO: at least one measured parity check failed |
| `3` | Assessment could not run (invalid config, oversized fixture, Python/import/transform error) |

Paths are resolved relative to the config file. Every fixture must be a regular `.csv` or `.parquet` file and no larger than `max_fixture_mb`; the setting is required to be in `1..=512`. Input remains on the machine running the command. There is no telemetry.

### Python transformation contract

```python
def clean_pandas(frame):
    return frame.assign(net=frame["gross"] - frame["fee"])

def clean_polars(frame):
    import polars as pl
    return frame.with_columns((pl.col("gross") - pl.col("fee")).alias("net"))
```

The embedded runner imports this module separately for each engine/sample. CSVs use `pandas.read_csv` and `polars.scan_csv`; Parquet uses `pandas.read_parquet` and `polars.scan_parquet`. A returned Polars `LazyFrame` is collected with the requested streaming engine when supported. Peak memory is the Python process maximum resident set size, not a per-operation allocation count.

### Comparison semantics

- `schema`: `strict` compares reported dtype names; `compatible` groups numeric, temporal, string, boolean and null families; `ignore` checks column names only.
- `order`: `strict` compares rows in emitted order; `ignore` performs a deterministic multiset comparison.
- `nulls`: `strict` distinguishes null from IEEE NaN; `nan_equal` treats either as missing.
- `timezone`: `strict` compares offsets as emitted; `utc` compares instants after UTC normalization; `ignore` removes timezone offsets while retaining local wall time.
- `float_abs` and `float_rel` use `abs(a-b) <= abs_tol + rel_tol * max(abs(a), abs(b))`.

The report’s **measured** section contains values observed from the runs. Its **heuristics** section is derived from Polars explain-plan text and always includes the matching rule and caveat; a heuristic can request review but cannot turn measured parity into a pass.

## Seeded proof

The checked-in suite intentionally introduces one value mismatch, one schema mismatch, and one order mismatch:

```sh
switchboard assess examples/seeded/switchboard.toml --json
```

It should return exit code `2` and report all three cases. This example is covered by comparator tests and is the recorded scenario on the product site.

## Development

```sh
npm ci
npm test
npm run build
```

`npm test` runs Rust formatting/lints/tests and the site checks. `npm run build` creates the release binary under `dist/bin/` and the deployable landing/docs site under `dist/site/` (with `index.html` at that root). To work on one part:

```sh
cargo test --workspace
npm run dev:site
npm run build:site
```

Create a registry-ready Rust package without publishing:

```sh
cargo package --manifest-path crates/switchboard/Cargo.toml
```

## Privacy and limits

All dataframe execution and report generation is local. Only the optional website license verifier contacts Sociobot after a user supplies or receives a purchase token. Read the site’s `/privacy/` and `/terms/` pages for that flow. Always use representative, redacted fixtures and validate a migration again under production-like load.

## License

MIT. See [LICENSE](LICENSE).
