import { Reveal } from "../Reveal";
import { stripe, DIWALI_START, money } from "@/lib/data";

const W = 800, H = 340, PAD = { l: 48, r: 16, t: 24, b: 36 };

const MARKERS: { date: string; label: string; anchor: "start" | "end"; dy: number }[] = [
  { date: "2025-10-25", label: "The pivot", anchor: "end", dy: 16 },
  { date: "2026-04-20", label: "Mother's Day Sales", anchor: "end", dy: 16 },
  { date: "2026-05-25", label: "Father's Day Sales", anchor: "start", dy: 46 },
];

export function RevenueChart() {
  const days = stripe.daily.filter((d) => d.date >= firstSale());
  const STEP = 20000;
  const max = Math.ceil(days[days.length - 1].cumulativeGross / STEP) * STEP;
  const x = (i: number) => PAD.l + (i / (days.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
  const line = days.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.cumulativeGross).toFixed(1)}`).join(" ");
  const area = `${line} L${x(days.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = Array.from({ length: max / STEP + 1 }, (_, k) => k * STEP);
  const dIdx = days.findIndex((d) => d.date >= DIWALI_START);
  const months = days.map((d, i) => ({ d, i })).filter(({ d }, k, arr) => d.date.slice(8) === "01" && k !== arr.length);

  return (
    <Reveal className="w-full" threshold={0.35}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative Stripe revenue over time" className="w-full">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeDasharray="2 4" />
            <text x={PAD.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--ink-soft)">{money(t)}</text>
          </g>
        ))}
        {months.filter((_, k) => k % 2 === 0).map(({ d, i }) => (
          <text key={d.date} x={x(i)} y={H - 12} textAnchor="middle" fontSize="11" fill="var(--ink-soft)">
            {new Date(d.date + "T12:00:00Z").toLocaleString("en-US", { month: "short", timeZone: "UTC" })}
          </text>
        ))}
        <path d={area} fill="var(--accent)" opacity="0.08" className="fade-in-late" />
        <path d={line} pathLength={1} className="draw-line" style={{ ["--len" as string]: 1 }} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {dIdx > 0 && (
          <g className="fade-in-late">
            <line x1={x(dIdx)} x2={x(dIdx)} y1={PAD.t} y2={y(0)} stroke="var(--ink)" strokeDasharray="3 3" opacity="0.5" />
            <text x={x(dIdx) - 8} y={PAD.t + 16} textAnchor="end" fontSize="17" fontStyle="italic" fill="var(--ink)">Diwali launch</text>
          </g>
        )}
        {MARKERS.map((m) => {
          const i = days.findIndex((d) => d.date >= m.date);
          if (i < 0) return null;
          return (
            <g key={m.label} className="fade-in-late">
              <line x1={x(i)} x2={x(i)} y1={PAD.t + m.dy - 10} y2={y(0)} stroke="var(--ink)" strokeDasharray="3 3" opacity="0.5" />
              <text x={x(i) + (m.anchor === "end" ? -8 : 8)} y={PAD.t + m.dy} textAnchor={m.anchor} fontSize="17" fontStyle="italic" fill="var(--ink)">{m.label}</text>
            </g>
          );
        })}
        <g className="fade-in-late">
          <circle cx={x(days.length - 1)} cy={y(days[days.length - 1].cumulativeGross)} r="5" fill="var(--accent)" />
        </g>
      </svg>
    </Reveal>
  );
}

function firstSale() {
  return stripe.daily.find((d) => d.gross > 0)!.date;
}
