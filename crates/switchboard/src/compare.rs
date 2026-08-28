use chrono::DateTime;
use serde_json::Value;

use crate::config::{ComparisonPolicy, NullMode, OrderMode, SchemaMode, TimezoneMode};
use crate::report::{Finding, FindingCategory};
use crate::runner::EngineOutput;

pub fn compare(
    pandas: &EngineOutput,
    polars: &EngineOutput,
    policy: &ComparisonPolicy,
) -> Vec<Finding> {
    let mut findings = Vec::new();

    if pandas.columns != polars.columns {
        findings.push(Finding::failure(
            FindingCategory::Schema,
            format!(
                "column names/order differ: Pandas {:?}; Polars {:?}",
                pandas.columns, polars.columns
            ),
        ));
    } else if !matches!(policy.schema, SchemaMode::Ignore) {
        let mismatches: Vec<String> = pandas
            .dtypes
            .iter()
            .zip(&polars.dtypes)
            .enumerate()
            .filter(|(_, (left, right))| !dtype_equal(left, right, policy.schema))
            .map(|(index, (left, right))| format!("{}: {left} vs {right}", pandas.columns[index]))
            .collect();
        if !mismatches.is_empty() {
            findings.push(Finding::failure(
                FindingCategory::Schema,
                format!("dtype mismatch ({})", mismatches.join(", ")),
            ));
        }
    }

    if pandas.rows.len() != polars.rows.len() {
        findings.push(Finding::failure(
            FindingCategory::Shape,
            format!(
                "row count differs: Pandas {}; Polars {}",
                pandas.rows.len(),
                polars.rows.len()
            ),
        ));
        return findings;
    }

    match policy.order {
        OrderMode::Strict => {
            let positional = row_mismatches(&pandas.rows, &polars.rows, policy);
            if !positional.is_empty() {
                let mut left = pandas.rows.clone();
                let mut right = polars.rows.clone();
                canonical_sort(&mut left);
                canonical_sort(&mut right);
                if row_mismatches(&left, &right, policy).is_empty() {
                    findings.push(Finding::failure(
                        FindingCategory::Order,
                        "the same rows were emitted in a different order".to_owned(),
                    ));
                } else {
                    findings.push(value_finding(&positional));
                }
            }
        }
        OrderMode::Ignore => {
            let mut left = pandas.rows.clone();
            let mut right = polars.rows.clone();
            canonical_sort(&mut left);
            canonical_sort(&mut right);
            let mismatches = row_mismatches(&left, &right, policy);
            if !mismatches.is_empty() {
                findings.push(value_finding(&mismatches));
            }
        }
    }

    findings
}

fn dtype_equal(left: &str, right: &str, mode: SchemaMode) -> bool {
    match mode {
        SchemaMode::Strict => left.eq_ignore_ascii_case(right),
        SchemaMode::Compatible => dtype_family(left) == dtype_family(right),
        SchemaMode::Ignore => true,
    }
}

fn dtype_family(dtype: &str) -> &'static str {
    let value = dtype.to_ascii_lowercase();
    if ["int", "uint", "float", "decimal"]
        .iter()
        .any(|needle| value.contains(needle))
    {
        "number"
    } else if ["datetime", "date", "time", "duration"]
        .iter()
        .any(|needle| value.contains(needle))
    {
        "temporal"
    } else if ["str", "string", "utf8", "object", "categorical"]
        .iter()
        .any(|needle| value.contains(needle))
    {
        "string"
    } else if value.contains("bool") {
        "boolean"
    } else if value.contains("null") {
        "null"
    } else {
        "other"
    }
}

fn row_mismatches(
    left: &[Vec<Value>],
    right: &[Vec<Value>],
    policy: &ComparisonPolicy,
) -> Vec<(usize, usize)> {
    let mut mismatches = Vec::new();
    for (row_index, (left_row, right_row)) in left.iter().zip(right).enumerate() {
        let width = left_row.len().max(right_row.len());
        for column_index in 0..width {
            let equal = left_row
                .get(column_index)
                .zip(right_row.get(column_index))
                .is_some_and(|(a, b)| value_equal(a, b, policy));
            if !equal {
                mismatches.push((row_index, column_index));
                if mismatches.len() == 5 {
                    return mismatches;
                }
            }
        }
    }
    mismatches
}

fn value_equal(left: &Value, right: &Value, policy: &ComparisonPolicy) -> bool {
    if left == right {
        return true;
    }
    if matches!(policy.nulls, NullMode::NanEqual)
        && ((left.is_null() && special_kind(right) == Some("nan"))
            || (right.is_null() && special_kind(left) == Some("nan")))
    {
        return true;
    }
    if let (Some(a), Some(b)) = (left.as_f64(), right.as_f64()) {
        return (a - b).abs() <= policy.float_abs + policy.float_rel * a.abs().max(b.abs());
    }
    if special_kind(left) == Some("datetime") && special_kind(right) == Some("datetime") {
        let a = special_value(left).unwrap_or_default();
        let b = special_value(right).unwrap_or_default();
        return datetime_equal(a, b, policy.timezone);
    }
    if special_kind(left) == Some("decimal")
        && special_kind(right) == Some("decimal")
        && let (Ok(a), Ok(b)) = (
            special_value(left).unwrap_or_default().parse::<f64>(),
            special_value(right).unwrap_or_default().parse::<f64>(),
        )
    {
        return (a - b).abs() <= policy.float_abs + policy.float_rel * a.abs().max(b.abs());
    }
    false
}

fn datetime_equal(left: &str, right: &str, mode: TimezoneMode) -> bool {
    match mode {
        TimezoneMode::Strict => left == right,
        TimezoneMode::Utc => match (
            DateTime::parse_from_rfc3339(left),
            DateTime::parse_from_rfc3339(right),
        ) {
            (Ok(a), Ok(b)) => a.timestamp_nanos_opt() == b.timestamp_nanos_opt(),
            _ => left == right,
        },
        TimezoneMode::Ignore => wall_time(left) == wall_time(right),
    }
}

fn wall_time(value: &str) -> &str {
    let after_date = value.find('T').map_or(0, |index| index + 1);
    let offset = value[after_date..]
        .find(['+', '-'])
        .map(|index| after_date + index)
        .or_else(|| value.strip_suffix('Z').map(|stripped| stripped.len()))
        .unwrap_or(value.len());
    &value[..offset]
}

fn special_kind(value: &Value) -> Option<&str> {
    value.get("$switchboard")?.as_str()
}

fn special_value(value: &Value) -> Option<&str> {
    value.get("value")?.as_str()
}

fn canonical_sort(rows: &mut [Vec<Value>]) {
    rows.sort_by(|a, b| {
        let left = serde_json::to_string(a).unwrap_or_default();
        let right = serde_json::to_string(b).unwrap_or_default();
        left.cmp(&right)
    });
}

fn value_finding(mismatches: &[(usize, usize)]) -> Finding {
    let locations = mismatches
        .iter()
        .map(|(row, column)| format!("row {}, column {}", row + 1, column + 1))
        .collect::<Vec<_>>()
        .join("; ");
    Finding::failure(
        FindingCategory::Value,
        format!("values differ at {locations} (showing at most 5)"),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    fn output(dtype: &str, rows: Vec<Vec<Value>>) -> EngineOutput {
        EngineOutput {
            columns: vec!["value".into()],
            dtypes: vec![dtype.into()],
            rows,
            elapsed_ms: 1.0,
            peak_memory_bytes: 1,
            streaming_requested: false,
            streaming_applied: false,
            plan: None,
        }
    }

    #[test]
    fn seeded_incompatibilities_are_all_classified() {
        let policy = ComparisonPolicy::default();
        let value = compare(
            &output("float64", vec![vec![Value::from(1.0)]]),
            &output("Float64", vec![vec![Value::from(2.0)]]),
            &policy,
        );
        let schema = compare(
            &output("float64", vec![vec![Value::from(1.0)]]),
            &output("String", vec![vec![Value::from(1.0)]]),
            &policy,
        );
        let order = compare(
            &output("int64", vec![vec![Value::from(1)], vec![Value::from(2)]]),
            &output("Int64", vec![vec![Value::from(2)], vec![Value::from(1)]]),
            &policy,
        );
        assert_eq!(value[0].category, FindingCategory::Value);
        assert_eq!(schema[0].category, FindingCategory::Schema);
        assert_eq!(order[0].category, FindingCategory::Order);
    }

    #[test]
    fn float_and_null_policy_is_honored() {
        let policy = ComparisonPolicy::default();
        let nan = serde_json::json!({"$switchboard":"nan"});
        assert!(value_equal(&Value::Null, &nan, &policy));
        assert!(value_equal(
            &Value::from(1.0),
            &Value::from(1.00000001),
            &policy
        ));
    }

    #[test]
    fn timezone_utc_compares_instants() {
        assert!(datetime_equal(
            "2026-01-01T12:00:00+00:00",
            "2026-01-01T07:00:00-05:00",
            TimezoneMode::Utc
        ));
    }
}
