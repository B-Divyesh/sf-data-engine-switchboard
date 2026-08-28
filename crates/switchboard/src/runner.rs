use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

use anyhow::{Context, Result, bail};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct EngineOutput {
    pub columns: Vec<String>,
    pub dtypes: Vec<String>,
    pub rows: Vec<Vec<Value>>,
    pub elapsed_ms: f64,
    pub peak_memory_bytes: u64,
    pub streaming_requested: bool,
    pub streaming_applied: bool,
    pub plan: Option<String>,
}

pub struct EmbeddedRunner {
    path: PathBuf,
}

impl EmbeddedRunner {
    pub fn create() -> Result<Self> {
        let nonce = SystemTime::now().duration_since(UNIX_EPOCH)?.as_nanos();
        let path = std::env::temp_dir().join(format!(
            "data-engine-switchboard-runner-{}-{nonce}.py",
            std::process::id()
        ));
        std::fs::write(&path, include_str!("runner.py"))
            .with_context(|| format!("could not create embedded runner at {}", path.display()))?;
        Ok(Self { path })
    }

    pub fn run(
        &self,
        python: &str,
        module: &Path,
        engine: &str,
        function: &str,
        fixture: &Path,
        streaming: bool,
    ) -> Result<EngineOutput> {
        let output = Command::new(python)
            .arg(&self.path)
            .arg(module)
            .arg(engine)
            .arg(function)
            .arg(fixture)
            .arg(if streaming { "true" } else { "false" })
            .env("PYTHONDONTWRITEBYTECODE", "1")
            .output()
            .with_context(|| format!("could not start Python command {python:?}"))?;
        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            let concise = stderr
                .lines()
                .rev()
                .find(|line| !line.trim().is_empty())
                .unwrap_or("unknown Python error");
            bail!("{engine} function {function} failed: {concise}");
        }
        serde_json::from_slice(&output.stdout).with_context(|| {
            format!("{engine} function {function} returned an unreadable runner result")
        })
    }
}

impl Drop for EmbeddedRunner {
    fn drop(&mut self) {
        let _ = std::fs::remove_file(&self.path);
    }
}
