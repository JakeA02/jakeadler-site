#!/usr/bin/env python3
"""Read-only export: lifetime Stripe gross charges by day -> src/data/stripe.json.

Source of truth for the revenue chart and headline revenue. Aggregate-only:
no customer, card, or email data is written.

Run (needs `stripe` + `python-dotenv`; reads STRIPE_SECRET_KEY from the Review Platform .env):
    /tmp/sv/bin/python scripts/export_stripe.py
"""

from __future__ import annotations

import datetime as dt
import json
import os
from collections import defaultdict
from pathlib import Path

from dotenv import load_dotenv

REVIEW_ROOT = Path(os.environ.get("REVIEW_PLATFORM", "/Users/jakeadler/ReviewPlatform"))
load_dotenv(REVIEW_ROOT / ".env")

import stripe  # noqa: E402

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "stripe.json"
START = dt.datetime(2025, 8, 1, tzinfo=dt.timezone.utc)

gross: dict[str, float] = defaultdict(float)
refunds: dict[str, float] = defaultdict(float)
count = 0

for c in stripe.Charge.list(created={"gte": int(START.timestamp())}, limit=100).auto_paging_iter():
    if not c.paid or c.status != "succeeded":
        continue
    count += 1
    day = dt.datetime.fromtimestamp(c.created, dt.timezone.utc).date().isoformat()
    gross[day] += c.amount / 100

for r in stripe.Refund.list(created={"gte": int(START.timestamp())}, limit=100).auto_paging_iter():
    if r.status == "succeeded":
        day = dt.datetime.fromtimestamp(r.created, dt.timezone.utc).date().isoformat()
        refunds[day] += r.amount / 100

today = dt.datetime.now(dt.timezone.utc).date()
d, cum_gross, cum_net, daily = START.date(), 0.0, 0.0, []
while d <= today:
    k = d.isoformat()
    cum_gross += gross[k]
    cum_net += gross[k] - refunds[k]
    daily.append(
        {
            "date": k,
            "gross": round(gross[k], 2),
            "refunds": round(refunds[k], 2),
            "cumulativeGross": round(cum_gross, 2),
            "cumulativeNet": round(cum_net, 2),
        }
    )
    d += dt.timedelta(days=1)

OUT.write_text(
    json.dumps(
        {
            "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
            "charges": count,
            "gross": round(cum_gross, 2),
            "refunds": round(sum(refunds.values()), 2),
            "net": round(cum_net, 2),
            "daily": daily,
        },
        indent=1,
    )
)
print(f"wrote {OUT} charges={count} gross={cum_gross:.2f} net={cum_net:.2f}")
