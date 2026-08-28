mod assess;
mod compare;
mod config;
mod report;
mod runner;

use std::path::PathBuf;
use std::process::ExitCode;

use anyhow::{Context, Result};
use clap::{Parser, Subcommand};

#[derive(Debug, Parser)]
#[command(
    name = "switchboard",
    version,
    about = "Decide whether a Pandas workload can move without silent output changes",
    long_about = "Runs declared Pandas and Polars transformations on the same local, bounded fixtures. Compares values, schema and order; samples runtime and peak process memory; and labels streaming-plan heuristics separately from measured facts. No data is uploaded."
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Debug, Subcommand)]
enum Command {
    /// Run every declared migration case and emit a go/no-go report
    Assess {
        /// TOML assessment file; paths inside it are relative to this file
        #[arg(default_value = "switchboard.toml")]
        config: PathBuf,
        /// Emit only the stable JSON report to stdout
        #[arg(long)]
        json: bool,
        /// Also write the JSON report to this path
        #[arg(short, long)]
        output: Option<PathBuf>,
        /// Disable terminal decoration and interactive affordances (the CLI never prompts)
        #[arg(long)]
        ci: bool,
    },
    /// Create a documented starter config, transformation module and redacted fixture
    Init {
        /// Directory that will receive the starter files
        #[arg(default_value = ".")]
        path: PathBuf,
        /// Replace starter files if they already exist
        #[arg(long)]
        force: bool,
    },
}

fn main() -> ExitCode {
    match run() {
        Ok(code) => ExitCode::from(code),
        Err(error) => {
            eprintln!("switchboard: {error:#}");
            ExitCode::from(3)
        }
    }
}

fn run() -> Result<u8> {
    match Cli::parse().command {
        Command::Assess {
            config,
            json,
            output,
            ci,
        } => {
            let report = assess::assess(&config)
                .with_context(|| format!("could not assess {}", config.display()))?;
            let serialized = serde_json::to_string_pretty(&report)?;
            if let Some(path) = output {
                std::fs::write(&path, format!("{serialized}\n"))
                    .with_context(|| format!("could not write report to {}", path.display()))?;
            }
            if json {
                println!("{serialized}");
            } else {
                report::print_human(&report, ci);
            }
            Ok(if report.decision == report::Decision::Go {
                0
            } else {
                2
            })
        }
        Command::Init { path, force } => {
            init(&path, force)?;
            println!("Created a local assessment in {}", path.display());
            println!("Next: edit transform.py, then run `switchboard assess`");
            Ok(0)
        }
    }
}

fn init(root: &std::path::Path, force: bool) -> Result<()> {
    let files = [
        ("switchboard.toml", include_str!("starter/switchboard.toml")),
        ("transform.py", include_str!("starter/transform.py")),
        ("fixtures/orders.csv", include_str!("starter/orders.csv")),
    ];
    for (relative, _) in &files {
        let target = root.join(relative);
        if target.exists() && !force {
            anyhow::bail!(
                "{} already exists; choose an empty directory or pass --force",
                target.display()
            );
        }
    }
    for (relative, content) in files {
        let target = root.join(relative);
        if let Some(parent) = target.parent() {
            std::fs::create_dir_all(parent)?;
        }
        std::fs::write(target, content)?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn init_refuses_to_overwrite_by_default() {
        let dir = tempfile::tempdir().unwrap();
        init(dir.path(), false).unwrap();
        let error = init(dir.path(), false).unwrap_err().to_string();
        assert!(error.contains("already exists"));
    }
}
