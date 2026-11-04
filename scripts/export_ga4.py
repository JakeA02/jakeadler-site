#!/usr/bin/env python3
"""Export daily Google Analytics 4 sessions/users into src/data/snapshot.json (aggregate-only).

No GA4 export existed in either repo, so this needs one-time setup:
  1. pip install google-analytics-data
  2. Create a service account with Viewer access on the GA4 property, download the JSON key.
  3. GOOGLE_APPLICATION_CREDENTIALS=/path/key.json GA4_PROPERTY_ID=123456789 python scripts/export_ga4.py

Alternative: in GA4 > Reports, export the daily Users/Sessions table as CSV and pass --csv file.csv
(columns: date as YYYYMMDD or YYYY-MM-DD, sessions, users).
"""

from __future__ import annotations

import argparse
import csv
import json
import os
from pathlib import Path

SNAPSHOT = Path(__file__).resolve().parents[1] / "src" / "data" / "snapshot.json"


def _norm(d: str) -> str:
    d = d.strip()
    return f"{d[:4]}-{d[4:6]}-{d[6:8]}" if len(d) == 8 and d.isdigit() else d


def from_api(start: str) -> list[dict]:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest

    client = BetaAnalyticsDataClient()
    req = RunReportRequest(
        property=f"properties/{os.environ['GA4_PROPERTY_ID']}",
        dimensions=[Dimension(name="date")],
        metrics=[Metric(name="sessions"), Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=start, end_date="today")],
        limit=100000,
    )
    out = []
    for row in client.run_report(req).rows:
        out.append(
            {
                "date": _norm(row.dimension_values[0].value),
                "sessions": int(row.metric_values[0].value),
                "users": int(row.metric_values[1].value),
            }
        )
    return sorted(out, key=lambda r: r["date"])


def from_csv(path: str) -> list[dict]:
    with open(path, newline="") as f:
        rows = [
            {"date": _norm(r["date"]), "sessions": int(r["sessions"]), "users": int(r["users"])}
            for r in csv.DictReader(f)
        ]
    return sorted(rows, key=lambda r: r["date"])


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--csv")
    p.add_argument("--start", default="2025-08-01")
    a = p.parse_args()
    daily = from_csv(a.csv) if a.csv else from_api(a.start)
    snap = json.loads(SNAPSHOT.read_text())
    snap["ga4"] = {
        "totalSessions": sum(r["sessions"] for r in daily),
        "totalUsers": sum(r["users"] for r in daily),
        "daily": daily,
    }
    SNAPSHOT.write_text(json.dumps(snap, indent=2))
    print(f"merged {len(daily)} GA4 days into {SNAPSHOT}")


if __name__ == "__main__":
    main()
