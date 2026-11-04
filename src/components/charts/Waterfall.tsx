import { Reveal } from "../Reveal";
import { snapshot, stripe, money } from "@/lib/data";

/**
 * All-time (Aug 2025 to today): Stripe revenue, then each cost, ending at what was left.
 * Ad spend only appears once Meta data is in the snapshot; until then the last bar is
 * labeled "Before ads" so the chart never overstates profit.
 */
export function Waterfall() {
  const t = snapshot.totals;
  const rev = stripe.gross;
  const hasAds = t.adSpend !== null && t.adSpend !== undefined;

  const steps: { label: string; v: number; kind: "total" | "cost" }[] = [
    { label: "Revenue", v: rev, kind: "total" },
    { label: "Refunds", v: -stripe.refunds, kind: "cost" },
    { label: "Print", v: -t.printSpend, kind: "cost" },
    { label: "AI", v: -t.genCosts, kind: "cost" },
    { label: "Payments", v: -t.stripeFees, kind: "cost" },
    ...(hasAds ? [{ label: "Ads", v: -(t.adSpend as number), kind: "cost" as const }] : []),
  ];
  const left = steps.reduce((s, x, i) => (i === 0 ? x.v : s + x.v), 0);
  steps.push({ label: hasAds ? "Left over" : "Before ads", v: left, kind: "total" });

  const W = 800, H = 300, top = 24, bottom = 40;
  const bw = steps.length > 6 ? 68 : 76;
  const gap = (W - steps.length * bw) / (steps.length + 1);
  const y = (v: number) => top + (1 - v / rev) * (H - top - bottom);
  let run = 0;

  return (
    <Reveal className="w-full" threshold={0.4}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Where each dollar went, all time" className="w-full">
        {steps.map((s, i) => {
          const x = gap + i * (bw + gap);
          let from: number, to: number;
          if (s.kind === "total") { from = 0; to = s.v; run = s.v; }
          else { from = run + s.v; to = run; run += s.v; }
          const last = i === steps.length - 1;
          const fill = s.kind === "total" ? (i === 0 ? "var(--ink)" : "var(--sage)") : "var(--accent)";
          return (
            <g key={s.label}>
              <rect className="grow-bar" style={{ ["--d" as string]: `${i * 220}ms`, transformBox: "fill-box" }}
                x={x} width={bw} y={y(to)} height={Math.max(y(from) - y(to), 1.5)} rx="2" fill={fill}
                opacity={s.kind === "cost" ? 0.85 : last && !hasAds ? 0.8 : 1} />
              <text x={x + bw / 2} y={H - 18} textAnchor="middle" fontSize="12" fill="var(--ink-soft)">{s.label}</text>
              <text className="fade-in-late" x={x + bw / 2} y={y(to) - 6} textAnchor="middle" fontSize="12" fill="var(--ink)">
                {s.kind === "cost" ? "−" : ""}{money(Math.abs(s.v))}
              </text>
            </g>
          );
        })}
      </svg>
    </Reveal>
  );
}
