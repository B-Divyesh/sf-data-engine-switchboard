# Data Engine Switchboard

Data Engine Switchboard checks a Pandas-to-Polars migration from the command line. It is for Python engineers who need evidence before changing a dataframe engine.

It runs matching transforms against a local, redacted fixture. The report lists value, schema, row-order, time, memory, and streaming warnings.

## Try the bundled sample

Install Pandas and Polars, then run the one-command demo:

```sh
python3 -m pip install -r examples/seeded/requirements.txt
cargo run --manifest-path crates/switchboard/Cargo.toml -- demo
```

The command creates a new temporary directory and prints its report path. The bundled fixture reports value, schema, and row-order differences. Its exit code is `2` because that sample is a no-go.

The site includes a self-hosted recording of this bundled command. Runtime and memory values in the recording vary by machine.

## Install and use

Build the CLI from source:

```sh
cargo install --path crates/switchboard
switchboard --help
```

Create a starter assessment:

```sh
switchboard init
```

Edit `switchboard.toml` to name your module and redacted fixtures. Each Pandas function returns a Pandas dataframe. Each Polars function returns a Polars dataframe or LazyFrame.

```sh
switchboard assess switchboard.toml --json --output switchboard-report.json
```

`--json` writes the report to standard output. `--output` writes the same JSON to a file. The CLI never prompts.

Exit codes:

| Code | Meaning |
| ---: | --- |
| `0` | Every configured comparison passed. |
| `2` | One or more measured comparisons failed. |
| `3` | The assessment could not run. |

Fixtures must be regular `.csv` or `.parquet` files. Set `max_fixture_mb` from 1 to 512. Paths are resolved from the config file.

## What the report checks

It rejects an oversized fixture before importing the transformation module.

Choose strict, compatible, or ignored schema checks. Choose strict or ignored row order. Set null, timezone, and float comparison rules in the TOML file.

Measured output differences decide the result. A streaming warning comes from the Polars execution plan. It asks for review and cannot turn a measured failure into a pass.

## Privacy

Dataframe execution and report generation run locally. The CLI has no telemetry and does not upload fixtures, reports, or transformation code.

The documentation site has no analytics or third-party requests. Its one-click demo uses only a `demo:` browser-storage key and never reads a real-user storage key. See the site’s `/privacy/` and `/terms/` pages.

## Development

```sh
npm ci
npm test
npm run build
```

Run `cargo package --manifest-path crates/switchboard/Cargo.toml --locked` to check the publishable crate without publishing it.

## License

MIT. See [LICENSE](LICENSE).
