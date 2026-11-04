import { Reveal } from "../Reveal";
import { diwaliDays, money } from "@/lib/data";

const W = 800, H = 300, PAD = { l: 44, r: 8, t: 20, b: 32 };

export function DiwaliChart() {
  const max = Math.ceil(Math.max(...diwaliDays.map((d) => d.revenue)) / 500) * 500;
  const bw = (W - PAD.l - PAD.r) / diwaliDays.length;
  const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
  const peak = diwaliDays.reduce((a, b) => (b.revenue > a.revenue ? b : a));
  const hasAds = diwaliDays.some((d) => d.adSpend);

  return (
    <Reveal className="w-full" threshold={0.35}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Daily Diwali sales" className="w-full">
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t * max)} y2={y(t * max)} stroke="var(--line)" strokeDasharray="2 4" />
            <text x={PAD.l - 8} y={y(t * max) + 4} textAnchor="end" fontSize="11" fill="var(--ink-soft)">{money(t * max)}</text>
          </g>
        ))}
        {diwaliDays.map((d, i) => (
          <g key={d.date}>
            <rect
              className="grow-bar"
              style={{ ["--d" as string]: `${i * 28}ms` }}
              x={PAD.l + i * bw + 1.5}
              width={bw - 3}
              y={y(d.revenue)}
              height={y(0) - y(d.revenue)}
              rx="2"
              fill={d.date === peak.date ? "var(--accent)" : "var(--ink)"}
              opacity={d.date === peak.date ? 1 : 0.78}
            />
          </g>
        ))}
        {[0, Math.floor(diwaliDays.length / 2), diwaliDays.length - 1].map((i) => (
          <text key={i} x={PAD.l + i * bw + bw / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--ink-soft)">
            {new Date(diwaliDays[i].date + "T12:00:00Z").toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
          </text>
        ))}
        <text className="fade-in-late" x={PAD.l + diwaliDays.findIndex((d) => d.date === peak.date) * bw} y={y(peak.revenue) - 8} fontSize="12" fontStyle="italic" fill="var(--accent)" textAnchor="middle">
          best day: {money(peak.revenue)}
        </text>
      </svg>
    </Reveal>
  );
}
