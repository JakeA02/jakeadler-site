#!/usr/bin/env python3
"""One-off export: first sale date and order count per book type -> src/data/books.json.

Aggregate-only (no customer data). Reuses the Review Platform's Firestore access.
    /Users/jakeadler/ReviewPlatform/api/.venv/bin/python scripts/export_books.py
"""
from __future__ import annotations

import json
import os
import sys
from collections import defaultdict
from pathlib import Path

REVIEW_ROOT = Path(os.environ.get("REVIEW_PLATFORM", "/Users/jakeadler/ReviewPlatform"))
sys.path.insert(0, str(REVIEW_ROOT / "api"))
os.chdir(REVIEW_ROOT)

from dotenv import load_dotenv  # noqa: E402

load_dotenv(REVIEW_ROOT / ".env")

from app.services import firebase  # noqa: E402
from app.services.dashboard.timeframes import order_at  # noqa: E402

OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "books.json"
NOT_SOLD = {"REFUNDED", "refunded", "IGNORE", "ignore", "flagged", "pass"}

first: dict[str, str] = {}
count: dict[str, int] = defaultdict(int)
for o in firebase.list_all_orders():
    if (o.get("status") or "").strip() in NOT_SOLD:
        continue
    at = order_at(o)
    if not at:
        continue
    bt = str(o.get("bookType") or "other")
    count[bt] += 1
    d = at.date().isoformat()
    if bt not in first or d < first[bt]:
        first[bt] = d

books = sorted(
    ({"bookType": k, "firstSale": first[k], "orders": count[k]} for k in first),
    key=lambda b: b["firstSale"],
)
OUT.write_text(json.dumps(books, indent=1))
for b in books:
    print(b)
