import { Reveal } from "../Reveal";

/**
 * Two durations on one scale. Length is time: 10 min fills the track, 90 sec
 * is a sliver of the same width. Not a chart — just before, after, and how
 * much shorter.
 */
const rows = [
  { label: "Before", value: "10 min", width: "100%", tone: "ink" as const, delay: "200ms" },
  { label: "After", value: "90 sec", width: "15%", tone: "sage" as const, delay: "550ms" },
];

export function ReviewTime() {
  return (
    <Reveal className="w-full" threshold={0.45}>
      <div
        role="img"
        aria-label="Review time dropped from 10 minutes to 90 seconds per order, 6.7 times faster"
      >
        <div className="space-y-6">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">{r.label}</p>
                <p
                  className={`whitespace-nowrap font-serif text-4xl leading-none lg:text-5xl ${
                    r.tone === "sage" ? "text-sage" : ""
                  }`}
                >
                  {r.value}
                </p>
              </div>
              <div className="h-2.5 overflow-hidden rounded-sm bg-line/70" aria-hidden="true">
                <div
                  className={`grow-x h-full rounded-sm ${r.tone === "sage" ? "bg-sage" : "bg-ink/40"}`}
                  style={{ width: r.width, ["--d" as string]: r.delay }}
                />
              </div>
            </div>
          ))}
        </div>
        <p
          className="step-in mt-5 font-serif text-lg italic text-sage"
          style={{ ["--d" as string]: "800ms" }}
        >
          6.7× faster
        </p>
      </div>
    </Reveal>
  );
}
