use std::collections::HashSet;
use std::path::{Path, PathBuf};

use anyhow::{Context, Result, bail};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Config {
    pub version: u8,
    #[serde(default = "default_python")]
    pub python: String,
    pub module: PathBuf,
    #[serde(default = "default_samples")]
    pub samples: usize,
    pub max_fixture_mb: u64,
    #[serde(default)]
    pub comparison: ComparisonPolicy,
    #[serde(rename = "case")]
    pub cases: Vec<CaseConfig>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CaseConfig {
    pub name: String,
    pub fixture: PathBuf,
    pub pandas: String,
    pub polars: String,
    #[serde(default = "default_true")]
    pub streaming: bool,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct ComparisonPolicy {
    #[serde(default)]
    pub schema: SchemaMode,
    #[serde(default)]
    pub order: OrderMode,
    #[serde(default)]
    pub nulls: NullMode,
    #[serde(default)]
    pub timezone: TimezoneMode,
    #[serde(default = "default_float_abs")]
    pub float_abs: f64,
    #[serde(default = "default_float_rel")]
    pub float_rel: f64,
}

#[derive(Debug, Clone, Copy, Default, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum SchemaMode {
    Strict,
    #[default]
    Compatible,
    Ignore,
}

#[derive(Debug, Clone, Copy, Default, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum OrderMode {
    #[default]
    Strict,
    Ignore,
}

#[derive(Debug, Clone, Copy, Default, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum NullMode {
    Strict,
    #[default]
    NanEqual,
}

#[derive(Debug, Clone, Copy, Default, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum TimezoneMode {
    Strict,
    #[default]
    Utc,
    Ignore,
}

impl Default for ComparisonPolicy {
    fn default() -> Self {
        Self {
            schema: SchemaMode::default(),
            order: OrderMode::default(),
            nulls: NullMode::default(),
            timezone: TimezoneMode::default(),
            float_abs: default_float_abs(),
            float_rel: default_float_rel(),
        }
    }
}

impl Config {
    pub fn load(path: &Path) -> Result<(Self, PathBuf)> {
        let text = std::fs::read_to_string(path)
            .with_context(|| format!("could not read {}", path.display()))?;
        let config: Self = toml::from_str(&text)
            .with_context(|| format!("{} is not a valid switchboard config", path.display()))?;
        config.validate()?;
        let base = path
            .canonicalize()
            .with_context(|| format!("could not resolve {}", path.display()))?
            .parent()
            .expect("config path has a parent")
            .to_path_buf();
        Ok((config, base))
    }

    fn validate(&self) -> Result<()> {
        if self.version != 1 {
            bail!("unsupported config version {}; expected 1", self.version);
        }
        if self.python.trim().is_empty() {
            bail!("python command cannot be empty");
        }
        if self.samples == 0 || self.samples > 10 {
            bail!("samples must be between 1 and 10");
        }
        if self.max_fixture_mb == 0 || self.max_fixture_mb > 512 {
            bail!("max_fixture_mb must be between 1 and 512");
        }
        if self.cases.is_empty() {
            bail!("at least one [[case]] is required");
        }
        if !self.comparison.float_abs.is_finite() || self.comparison.float_abs < 0.0 {
            bail!("comparison.float_abs must be a finite non-negative number");
        }
        if !self.comparison.float_rel.is_finite() || self.comparison.float_rel < 0.0 {
            bail!("comparison.float_rel must be a finite non-negative number");
        }
        let mut names = HashSet::new();
        for case in &self.cases {
            if case.name.trim().is_empty() {
                bail!("case names cannot be empty");
            }
            if !names.insert(&case.name) {
                bail!("duplicate case name {:?}", case.name);
            }
            for (label, function) in [("pandas", &case.pandas), ("polars", &case.polars)] {
                if !valid_identifier(function) {
                    bail!("case {:?} has invalid {label} function name", case.name);
                }
            }
            let extension = case
                .fixture
                .extension()
                .and_then(|value| value.to_str())
                .unwrap_or_default()
                .to_ascii_lowercase();
            if extension != "csv" && extension != "parquet" {
                bail!("case {:?} fixture must be .csv or .parquet", case.name);
            }
        }
        Ok(())
    }
}

fn valid_identifier(value: &str) -> bool {
    let mut chars = value.chars();
    chars
        .next()
        .is_some_and(|c| c == '_' || c.is_ascii_alphabetic())
        && chars.all(|c| c == '_' || c.is_ascii_alphanumeric())
}

fn default_python() -> String {
    "python3".to_owned()
}
fn default_samples() -> usize {
    3
}
fn default_true() -> bool {
    true
}
fn default_float_abs() -> f64 {
    1e-9
}
fn default_float_rel() -> f64 {
    1e-7
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_unbounded_and_empty_assessments() {
        let parsed: Config = toml::from_str(
            r#"version=1
module="x.py"
max_fixture_mb=0
case=[]"#,
        )
        .unwrap();
        assert!(parsed.validate().is_err());
    }
}
