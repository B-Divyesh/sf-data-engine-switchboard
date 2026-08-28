def clean_pandas(frame):
    return frame.assign(net=frame["gross"] - frame["fee"])


def clean_polars(frame):
    import polars as pl
    return frame.with_columns((pl.col("gross") - pl.col("fee")).alias("net"))

