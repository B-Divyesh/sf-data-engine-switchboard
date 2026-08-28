use serde::Serialize;

use crate::config::ComparisonPolicy;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Decision {
    Go,
    NoGo,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum FindingCategory {
    Schema,
    Shape,
    Order,
    Value,
    Stability,
    ExecutionMode,
}

#[derive(Debug, Clone, Serialize)]
pub struct Finding {
    pub category: FindingCategory,
    pub severity: &'static str,
    pub detail: String,
}

impl Finding {
    pub fn failure(category: FindingCategory, detail: String) -> Self {
        Self {
            category,
            severity: "failure",
            detail,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct AssessmentReport {
    pub schema_version: u8,
    pub tool: ToolInfo,
    pub decision: Decision,
    pub review_recommended: bool,
    pub privacy: &'static str,
    pub comparison: ComparisonPolicy,
    pub summary: Summary,
    pub cases: Vec<CaseReport>,
}

#[derive(Debug, Serialize)]
pub struct ToolInfo {
    pub name: &'static str,
    pub version: &'static str,
}

#[derive(Debug, Serialize)]
pub struct Summary {
    pub total: usize,
    pub passed: usize,
    pub failed: usize,
    pub heuristic_flags: usize,
}

#[derive(Debug, Serialize)]
pub struct CaseReport {
    pub name: String,
    pub fixture: FixtureFact,
    pub passed: bool,
    pub measured: MeasuredFacts,
    pub findings: Vec<Finding>,
    pub heuristics: Vec<HeuristicFlag>,
}

#[derive(Debug, Serialize)]
pub struct FixtureFact {
    pub path: String,
    pub bytes: u64,
    pub bounded_by_mb: u64,
}

#[derive(Debug, Serialize)]
pub struct MeasuredFacts {
    pub output_rows: EnginePair<usize>,
    pub output_columns: EnginePair<usize>,
    pub runtime_ms: EnginePair<SampleStats>,
    pub peak_process_memory_bytes: EnginePair<SampleStats>,
    pub streaming: StreamingFact,
}

#[derive(Debug, Serialize)]
pub struct EnginePair<T> {
    pub pandas: T,
    pub polars: T,
}

#[derive(Debug, Serialize)]
pub struct SampleStats {
    pub samples: usize,
    pub min: f64,
    pub median: f64,
    pub max: f64,
}

#[derive(Debug, Serialize)]
pub struct StreamingFact {
    pub requested: bool,
    pub applied: bool,
    pub plan_excerpt: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct HeuristicFlag {
    pub rule: &'static str,
    pub evidence: String,
    pub caveat: &'static str,
}

pub fn print_human(report: &AssessmentReport, _ci: bool) {
    println!("DATA ENGINE SWITCHBOARD // {}", report.tool.version);
    println!("════════════════════════════════════════════════════");
    println!(
        "DECISION  {}    {} passed / {} failed",
        match report.decision {
            Decision::Go => "GO",
            Decision::NoGo => "NO-GO",
        },
        report.summary.passed,
        report.summary.failed
    );
    println!("Measured facts determine the decision. Heuristics only request review.\n");

    for case in &report.cases {
        println!(
            "[{}] {}",
            if case.passed { "PASS" } else { "FAIL" },
            case.name
        );
        println!(
            "  fixture  {} ({} bytes, limit {} MB)",
            case.fixture.path, case.fixture.bytes, case.fixture.bounded_by_mb
        );
        println!(
            "  rows     pandas {} │ polars {}",
            case.measured.output_rows.pandas, case.measured.output_rows.polars
        );
        println!(
            "  runtime  pandas {} │ polars {}",
            format_stats(&case.measured.runtime_ms.pandas, "ms"),
            format_stats(&case.measured.runtime_ms.polars, "ms")
        );
        println!(
            "  peak RSS pandas {} │ polars {}",
            format_stats(&case.measured.peak_process_memory_bytes.pandas, "B"),
            format_stats(&case.measured.peak_process_memory_bytes.polars, "B")
        );
        println!(
            "  stream   requested {} │ applied {}",
            case.measured.streaming.requested, case.measured.streaming.applied
        );
        for finding in &case.findings {
            println!("  ! {:?}: {}", finding.category, finding.detail);
        }
        for flag in &case.heuristics {
            println!("  ? {}: {}", flag.rule, flag.evidence);
        }
        println!();
    }
    if report.review_recommended {
        println!(
            "REVIEW    {} streaming-plan heuristic flag(s); inspect JSON for caveats.",
            report.summary.heuristic_flags
        );
    }
    println!("LOCAL     No fixture data was uploaded.");
}

fn format_stats(stats: &SampleStats, suffix: &str) -> String {
    format!(
        "{:.2}{suffix} median ({:.2}–{:.2}, n={})",
        stats.median, stats.min, stats.max, stats.samples
    )
}
