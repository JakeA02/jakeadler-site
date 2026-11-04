import raw from "@/data/snapshot.json";
import rawStripe from "@/data/stripe.json";

type Day = {
  date: string;
  revenue: number;
  orders: number;
  adSpend: number | null;
  printSpend: number;
  genCosts: number;
  stripeFees: number;
  profit: number;
  cumulativeRevenue: number;
};

type Snapshot = {
  generatedAt: string;
  totals: {
    revenue: number;
    orders: number;
    customers: number;
    repeatRate: number;
    printSpend: number;
    genCosts: number;
    stripeFees: number;
    adSpend: number | null;
    profit: number;
  };
  daily: Day[];
  ga4: { totalSessions: number; daily: { date: string; sessions: number }[] } | null;
};

type StripeDay = {
  date: string;
  gross: number;
  refunds: number;
  cumulativeGross: number;
  cumulativeNet: number;
};

type StripeExport = {
  generatedAt: string;
  charges: number;
  gross: number;
  refunds: number;
  net: number;
  daily: StripeDay[];
};

/** Orders, costs, and daily operating data (Firestore + Review Platform logic). */
export const snapshot = raw as unknown as Snapshot;

/** Lifetime Stripe charges since Aug 2025. Source of truth for revenue. */
export const stripe = rawStripe as unknown as StripeExport;

export const DIWALI_START = "2026-09-17";
export const DIWALI_END = "2026-10-31";

export const diwaliDays = snapshot.daily.filter((d) => d.date >= DIWALI_START && d.date <= DIWALI_END);
export const diwaliRevenue = diwaliDays.reduce((s, d) => s + d.revenue, 0);

export const money = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : `$${Math.round(n)}`;
