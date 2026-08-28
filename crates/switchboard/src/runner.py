"""Embedded Python bridge. It never performs network I/O."""

import datetime as dt
import decimal
import importlib.util
import json
import math
import resource
import sys
import time
import traceback


def load_module(path):
    spec = importlib.util.spec_from_file_location("switchboard_user_transform", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot import transformation module: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def special(kind, value=None):
    result = {"$switchboard": kind}
    if value is not None:
        result["value"] = value
    return result


def normalize(value):
    if value is None:
        return None
    if hasattr(value, "item") and not isinstance(value, (str, bytes)):
        try:
            value = value.item()
        except (ValueError, AttributeError):
            pass
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        if math.isnan(value):
            return special("nan")
        if math.isinf(value):
            return special("infinity", "positive" if value > 0 else "negative")
        return value
    if isinstance(value, decimal.Decimal):
        return special("decimal", str(value))
    if isinstance(value, dt.datetime):
        return special("datetime", value.isoformat())
    if isinstance(value, dt.date):
        return special("date", value.isoformat())
    if isinstance(value, dt.time):
        return special("time", value.isoformat())
    if isinstance(value, bytes):
        return special("bytes", value.hex())
    if isinstance(value, str):
        return value
    try:
        if bool(value != value):
            return special("nan")
    except (TypeError, ValueError):
        pass
    # pd.NA / NaT and similar scalar missing sentinels.
    try:
        import pandas as pd

        missing = pd.isna(value)
        if isinstance(missing, bool) and missing:
            return None
    except (ImportError, TypeError, ValueError):
        pass
    return special("repr", repr(value))


def peak_rss_bytes():
    value = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    return int(value if sys.platform == "darwin" else value * 1024)


def pandas_run(module, function_name, fixture):
    import pandas as pd

    extension = fixture.rsplit(".", 1)[-1].lower()
    started = time.perf_counter()
    frame = pd.read_csv(fixture) if extension == "csv" else pd.read_parquet(fixture)
    output = getattr(module, function_name)(frame)
    elapsed_ms = (time.perf_counter() - started) * 1000
    if not isinstance(output, pd.DataFrame):
        raise TypeError(f"{function_name} must return pandas.DataFrame, got {type(output).__name__}")
    rows = [[normalize(value) for value in row] for row in output.itertuples(index=False, name=None)]
    return {
        "columns": [str(column) for column in output.columns],
        "dtypes": [str(dtype) for dtype in output.dtypes],
        "rows": rows,
        "elapsed_ms": elapsed_ms,
        "peak_memory_bytes": peak_rss_bytes(),
        "streaming_requested": False,
        "streaming_applied": False,
        "plan": None,
    }


def explain(lazy):
    for kwargs in ({"engine": "streaming"}, {"streaming": True}, {}):
        try:
            return lazy.explain(**kwargs)
        except TypeError:
            continue
        except Exception as error:
            return f"EXPLAIN UNAVAILABLE: {type(error).__name__}: {error}"
    return "EXPLAIN UNAVAILABLE"


def polars_run(module, function_name, fixture, streaming):
    import polars as pl

    extension = fixture.rsplit(".", 1)[-1].lower()
    started = time.perf_counter()
    frame = pl.scan_csv(fixture) if extension == "csv" else pl.scan_parquet(fixture)
    output = getattr(module, function_name)(frame)
    plan = None
    applied = False
    if isinstance(output, pl.LazyFrame):
        plan = explain(output)
        if streaming:
            try:
                output = output.collect(engine="streaming")
                applied = True
            except TypeError:
                output = output.collect(streaming=True)
                applied = True
        else:
            output = output.collect()
    if not isinstance(output, pl.DataFrame):
        raise TypeError(f"{function_name} must return polars LazyFrame or DataFrame, got {type(output).__name__}")
    elapsed_ms = (time.perf_counter() - started) * 1000
    rows = [[normalize(value) for value in row] for row in output.iter_rows()]
    return {
        "columns": [str(column) for column in output.columns],
        "dtypes": [str(dtype) for dtype in output.dtypes],
        "rows": rows,
        "elapsed_ms": elapsed_ms,
        "peak_memory_bytes": peak_rss_bytes(),
        "streaming_requested": bool(streaming),
        "streaming_applied": applied,
        "plan": plan,
    }


def main():
    if len(sys.argv) != 6:
        raise RuntimeError("runner expects: module engine function fixture streaming")
    _, module_path, engine, function_name, fixture, streaming_text = sys.argv
    module = load_module(module_path)
    if not hasattr(module, function_name):
        raise AttributeError(f"{module_path} has no function {function_name}")
    streaming = streaming_text == "true"
    result = (
        pandas_run(module, function_name, fixture)
        if engine == "pandas"
        else polars_run(module, function_name, fixture, streaming)
    )
    print(json.dumps(result, separators=(",", ":"), allow_nan=False))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

