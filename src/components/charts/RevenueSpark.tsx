import { Reveal } from "../Reveal";
import { stripe, DIWALI_START } from "@/lib/data";

const W = 320, H = 120, PAD = 6;

/** Month-end cumulative totals — avoids long flat spans from zero-revenue days in a tiny chart. */
function monthEnds() {
  const first = stripe.daily.findIndex((d) => d.gross > 0);
  const byMonth = new Map<string, number>();
  for (const d of stripe.daily.slice(first)) {
    byMonth.set(d.date.slice(0, 7), d.cumulativeGross);
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, cumulativeGross]) => ({ month, cumulativeGross }));
}

/** Thumbnail of the cumulative revenue chart for the story summary. */
export function RevenueSpark() {
  const points = monthEnds();
  const max = points[points.length - 1].cumulativeGross;
  const n = points.length - 1;
  const x = (i: number) => PAD + (i / n) * (W - PAD * 2);
  const y = (v: number) => PAD + (1 - v / max) * (H - PAD * 2);
  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.cumulativeGross).toFixed(1)}`).join(" ");
  const area = `${line} L${x(n)},${H - PAD} L${x(0)},${H - PAD} Z`;
  const diwaliMonth = DIWALI_START.slice(0, 7);
  const diwaliFrom = points.findIndex((p) => p.month >= diwaliMonth);

  return (
    <Reveal className="w-full" threshold={0.4}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative revenue by month, rising through Diwali" className="w-full">
        <path d={area} fill="var(--accent)" opacity="0.1" className="fade-in-late" />
        {diwaliFrom > 0 && (
          <rect
            x={x(diwaliFrom)}
            y={PAD}
            width={W - PAD - x(diwaliFrom)}
            height={H - PAD * 2}
            fill="var(--accent)"
            opacity="0.08"
            className="fade-in-late"
          />
        )}
        <path
          d={line}
          pathLength={1}
          className="draw-line"
          style={{ ["--len" as string]: 1 }}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={x(n)} cy={y(max)} r="4" fill="var(--accent)" className="fade-in-late" />
      </svg>
    </Reveal>
  );
}
