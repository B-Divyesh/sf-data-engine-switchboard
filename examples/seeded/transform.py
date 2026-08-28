import polars as pl


def value_pandas(frame):
    return frame.assign(net=frame["gross"] - frame["fee"])[["order_id", "net"]]


def value_polars(frame):
    # Intentional incompatibility: a legacy port adds one cent.
    return frame.select("order_id", (pl.col("gross") - pl.col("fee") + 0.01).alias("net"))


def schema_pandas(frame):
    result = frame[["order_id", "region"]].copy()
    result["order_id"] = result["order_id"].astype(str)
    return result


def schema_polars(frame):
    # Intentional incompatibility: identifier remains numeric.
    return frame.select("order_id", "region")


def order_pandas(frame):
    return frame[["order_id", "gross"]].sort_values("gross", ascending=True)


def order_polars(frame):
    # Intentional incompatibility: direction is reversed.
    return frame.select("order_id", "gross").sort("gross", descending=True)

