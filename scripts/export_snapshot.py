#!/usr/bin/env python3
"""One-off export: Firestore orders + Meta Ads -> sanitized, aggregate-only JSON.

Reuses the Review Platform's dashboard logic so numbers match the founder overview.
No customer names, emails, or addresses are written. Only daily/aggregate figures.

Run (uses the Review Platform's venv and .env; nothing is copied into this repo):
    /Users/jakeadler/ReviewPlatform/api/.venv/bin/python scripts/export_snapshot.py
Optional:
    --start 2025-08-01   first day to include (default 2025-08-01)
Outputs: src/data/snapshot.json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

REVIEW_ROOT = Path(os.environ.get("REVIEW_PLATFORM", "/Users/jakeadler/ReviewPlatform"))
sys.path.insert(0, str(REVIEW_ROOT / "api"))
os.chdir(REVIEW_ROOT)

from dotenv import load_dotenv  # noqa: E402

load_dotenv(REVIEW_ROOT / ".env")

from app.services import firebase  # noqa: E402
from app.services.dashboard import amounts, financials, meta_ads, timeframes  # noqa: E402
from app.services.dashboard.timeframes import in_window, order_at  # noqa: E402

def _fetch_ad_spend_paged(start: datetime, end: datetime) -> dict:
    """Meta insights returns ~25 daily rows per page; the Review Platform helper does not
    follow `paging.next`, which silently truncates long ranges. This follows every page."""
    import httpx
    from app.settings import get_settings

    s = get_settings()
    act = s.meta_ad_account_id.strip()
    act = act if act.startswith("act_") else f"act_{act}"
    url = f"https://graph.facebook.com/v21.0/{act}/insights"
    params = {
        "fields": "spend",
        "time_range": f'{{"since":"{start.date().isoformat()}","until":"{end.date().isoformat()}"}}',
        "time_increment": 1,
        "limit": 500,
        "access_token": s.meta_access_token,
    }
    by_day: dict[str, float] = {}
    try:
        with httpx.Client(timeout=30.0) as client:
            nxt, p = url, params
            while nxt:
                r = client.get(nxt, params=p)
                body = r.json()
                if r.status_code >= 400:
                    msg = (body.get("error") or {}).get("message") or r.text
                    return {"configured": True, "total": None, "byDay": {}, "error": str(msg)}
                for row in body.get("data") or []:
                    d = row.get("date_start")
                    by_day[d] = round(by_day.get(d, 0) + float(row.get("spend") or 0), 2)
                nxt, p = (body.get("paging") or {}).get("next"), None
    except Exception as exc:  # noqa: BLE001
        return {"configured": True, "total": None, "byDay": {}, "error": str(exc)}
    return {"configured": True, "total": round(sum(by_day.values()), 2), "byDay": by_day, "error": None}


meta_ads.fetch_ad_spend = _fetch_ad_spend_paged  # type: ignore[assignment]

OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "snapshot.json"
NOT_SOLD = {"REFUNDED", "refunded", "IGNORE", "ignore", "flagged", "pass"}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", default="2025-08-01")
    args = parser.parse_args()

    start = datetime.fromisoformat(args.start).replace(tzinfo=timezone.utc)
    end = datetime.now(timezone.utc)

    orders = [o for o in firebase.list_all_orders() if (o.get("status") or "").strip() not in NOT_SOLD]
    in_range = [o for o in orders if in_window(o, start, end)]

    ads = meta_ads.fetch_ad_spend(start, end)
    days = (end.date() - start.date()).days + 1
    fin = financials.aggregate(
        orders,
        start,
        end,
        days,
        "all",
        ads,
        stripe_fees=None,
        stripe_fee_source="estimated",
        resolve_missing_print_costs=False,
    )

    # Repeat-customer rate and book mix, computed without writing any identifiers.
    emails = Counter((o.get("customerEmail") or "").strip().lower() for o in in_range)
    emails.pop("", None)
    customers = len(emails)
    repeat = sum(1 for c in emails.values() if c > 1)
    books = Counter(str(o.get("bookType") or "other") for o in in_range)

    # Cumulative revenue series.
    cumulative = 0.0
    series = []
    for row in fin["daily"]:
        cumulative = round(cumulative + row["revenue"], 2)
        series.append({**row, "cumulativeRevenue": cumulative})

    snapshot = {
        "generatedAt": end.isoformat(),
        "range": {"start": start.date().isoformat(), "end": end.date().isoformat()},
        "totals": {
            "revenue": fin["stripeRevenue"],
            "orders": fin["orderCount"],
            "customers": customers,
            "repeatCustomers": repeat,
            "repeatRate": round(repeat / customers, 4) if customers else 0,
            "printSpend": fin["printSpend"],
            "genCosts": fin["genCosts"],
            "stripeFees": fin["stripeFees"],
            "adSpend": fin["adSpend"],
            "profit": fin["profit"],
        },
        "bookMix": dict(books.most_common()),
        "daily": series,
        "meta": {"adsConfigured": ads.get("configured"), "adsError": ads.get("error")},
        "ga4": None,  # filled by scripts/export_ga4.py
    }

    # Last-30-day window for the unit-economics waterfall.
    from datetime import timedelta

    s30 = end - timedelta(days=30)
    last30 = financials.aggregate(
        orders,
        s30,
        end,
        30,
        "30d",
        meta_ads.fetch_ad_spend(s30, end),
        resolve_missing_print_costs=False,
    )
    snapshot["last30"] = {
        k: last30[k]
        for k in ("stripeRevenue", "printSpend", "genCosts", "stripeFees", "adSpend", "profit", "orderCount")
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(snapshot, indent=2))
    print(f"wrote {OUT} | revenue={fin['stripeRevenue']} orders={fin['orderCount']} customers={customers}")


if __name__ == "__main__":
    main()
