use std::path::Path;

use anyhow::{Context, Result, bail};

use crate::compare;
use crate::config::Config;
use crate::report::{
    AssessmentReport, CaseReport, Decision, EnginePair, Finding, FindingCategory, FixtureFact,
    HeuristicFlag, MeasuredFacts, SampleStats, StreamingFact, Summary, ToolInfo,
};
use crate::runner::{EmbeddedRunner, EngineOutput};

pub fn assess(config_path: &Path) -> Result<AssessmentReport> {
    let (config, base) = Config::load(config_path)?;
    let module = base.join(&config.module);
    require_file(&module, "transformation module")?;
    let runner = EmbeddedRunner::create()?;
    let mut cases = Vec::with_capacity(config.cases.len());

    for case in &config.cases {
        let fixture = base.join(&case.fixture);
        let metadata = require_file(&fixture, "fixture")?;
        let limit = config.max_fixture_mb * 1024 * 1024;
        if metadata.len() > limit {
            bail!(
                "fixture {} is {} bytes, above the declared {} MB limit",
                case.fixture.display(),
                metadata.len(),
                config.max_fixture_mb
            );
        }

        let mut pandas_runs = Vec::with_capacity(config.samples);
        let mut polars_runs = Vec::with_capacity(config.samples);
        for _ in 0..config.samples {
            pandas_runs.push(runner.run(
                &config.python,
                &module,
                "pandas",
                &case.pandas,
                &fixture,
                false,
            )?);
            polars_runs.push(runner.run(
                &config.python,
                &module,
                "polars",
                &case.polars,
                &fixture,
                case.streaming,
            )?);
        }
        validate_output(&pandas_runs[0], "Pandas")?;
        validate_output(&polars_runs[0], "Polars")?;

        let mut findings = compare::compare(&pandas_runs[0], &polars_runs[0], &config.comparison);
        if pandas_runs
            .iter()
            .skip(1)
            .any(|run| run.rows != pandas_runs[0].rows)
        {
            findings.push(Finding::failure(
                FindingCategory::Stability,
                "Pandas output changed between samples".to_owned(),
            ));
        }
        if polars_runs
            .iter()
            .skip(1)
            .any(|run| run.rows != polars_runs[0].rows)
        {
            findings.push(Finding::failure(
                FindingCategory::Stability,
                "Polars output changed between samples".to_owned(),
            ));
        }
        if case.streaming && !polars_runs[0].streaming_applied {
            findings.push(Finding::failure(
                FindingCategory::ExecutionMode,
                "streaming was requested but the returned result was not collected through the streaming engine".to_owned(),
            ));
        }

        let heuristics = plan_heuristics(polars_runs[0].plan.as_deref());
        let measured = MeasuredFacts {
            output_rows: EnginePair {
                pandas: pandas_runs[0].rows.len(),
                polars: polars_runs[0].rows.len(),
            },
            output_columns: EnginePair {
                pandas: pandas_runs[0].columns.len(),
                polars: polars_runs[0].columns.len(),
            },
            runtime_ms: EnginePair {
                pandas: stats(pandas_runs.iter().map(|run| run.elapsed_ms)),
                polars: stats(polars_runs.iter().map(|run| run.elapsed_ms)),
            },
            peak_process_memory_bytes: EnginePair {
                pandas: stats(pandas_runs.iter().map(|run| run.peak_memory_bytes as f64)),
                polars: stats(polars_runs.iter().map(|run| run.peak_memory_bytes as f64)),
            },
            streaming: StreamingFact {
                requested: case.streaming,
                applied: polars_runs[0].streaming_applied,
                plan_excerpt: polars_runs[0]
                    .plan
                    .as_deref()
                    .map(|plan| plan.chars().take(4000).collect()),
            },
        };
        cases.push(CaseReport {
            name: case.name.clone(),
            fixture: FixtureFact {
                path: case.fixture.display().to_string(),
                bytes: metadata.len(),
                bounded_by_mb: config.max_fixture_mb,
            },
            passed: findings.is_empty(),
            measured,
            findings,
            heuristics,
        });
    }

    let passed = cases.iter().filter(|case| case.passed).count();
    let heuristic_flags = cases.iter().map(|case| case.heuristics.len()).sum();
    Ok(AssessmentReport {
        schema_version: 1,
        tool: ToolInfo {
            name: "data-engine-switchboard",
            version: env!("CARGO_PKG_VERSION"),
        },
        decision: if passed == cases.len() {
            Decision::Go
        } else {
            Decision::NoGo
        },
        review_recommended: heuristic_flags > 0,
        privacy: "local_only_no_upload",
        comparison: config.comparison,
        summary: Summary {
            total: cases.len(),
            passed,
            failed: cases.len() - passed,
            heuristic_flags,
        },
        cases,
    })
}

fn require_file(path: &Path, label: &str) -> Result<std::fs::Metadata> {
    let metadata = std::fs::metadata(path)
        .with_context(|| format!("{label} {} does not exist", path.display()))?;
    if !metadata.is_file() {
        bail!("{label} {} is not a regular file", path.display());
    }
    Ok(metadata)
}

fn validate_output(output: &EngineOutput, engine: &str) -> Result<()> {
    if output.columns.len() != output.dtypes.len() {
        bail!("{engine} returned inconsistent column and dtype metadata");
    }
    if output
        .rows
        .iter()
        .any(|row| row.len() != output.columns.len())
    {
        bail!("{engine} returned a row with an inconsistent width");
    }
    Ok(())
}

fn stats(values: impl Iterator<Item = f64>) -> SampleStats {
    let mut values: Vec<f64> = values.collect();
    values.sort_by(f64::total_cmp);
    let count = values.len();
    let median = if count.is_multiple_of(2) {
        (values[count / 2 - 1] + values[count / 2]) / 2.0
    } else {
        values[count / 2]
    };
    SampleStats {
        samples: count,
        min: values[0],
        median,
        max: values[count - 1],
    }
}

fn plan_heuristics(plan: Option<&str>) -> Vec<HeuristicFlag> {
    let Some(plan) = plan else {
        return Vec::new();
    };
    let upper = plan.to_ascii_uppercase();
    let rules = [
        (
            "python_udf",
            ["PYTHON", "UDF", "MAP_ELEMENTS"].as_slice(),
            "A Python/UDF marker appears in the explain plan.",
        ),
        (
            "global_sort",
            ["SORT"].as_slice(),
            "A sort marker appears in the explain plan.",
        ),
        (
            "join_state",
            ["JOIN"].as_slice(),
            "A join marker appears in the explain plan.",
        ),
        (
            "explicit_fallback",
            ["FALLBACK", "IN-MEMORY"].as_slice(),
            "The explain plan contains an explicit fallback/materialization marker.",
        ),
    ];
    rules
        .into_iter()
        .filter(|(_, needles, _)| needles.iter().any(|needle| upper.contains(needle)))
        .map(|(rule, _, evidence)| HeuristicFlag {
            rule,
            evidence: evidence.to_owned(),
            caveat: "Plan text and engine behavior vary by Polars version. This is a review signal, not a measured fallback or parity failure.",
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn stats_are_sorted_and_median_is_stable() {
        let sample = stats([8.0, 2.0, 3.0, 5.0].into_iter());
        assert_eq!(sample.min, 2.0);
        assert_eq!(sample.median, 4.0);
        assert_eq!(sample.max, 8.0);
    }

    #[test]
    fn plan_flags_are_explicitly_heuristic() {
        let flags = plan_heuristics(Some("SORT\nINNER JOIN"));
        assert_eq!(flags.len(), 2);
        assert!(
            flags
                .iter()
                .all(|flag| flag.caveat.contains("not a measured"))
        );
    }
}
