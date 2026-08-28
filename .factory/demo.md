# Demo sandbox

- Web demo: `https://data-engine-switchboard.sociobot.in/demo/` or `/?demo=1`.
- CLI demo: `switchboard demo`.

The web entry displays the three intentional differences from the bundled CLI sample. It stores only `demo:data-engine-switchboard:opened`. It never reads or writes production keys such as `sb_license:*`, and it makes no production API call. **Reset demo** clears and reseeds the `demo:` namespace. **Start for real** clears that namespace and returns home.

`switchboard demo` creates a unique directory under the operating system temporary directory. It writes a bundled CSV, TOML config, Python transformations, and `switchboard-report.json`; then it prints both paths. The report has intentional value, schema, and order failures.
