import { Reveal } from "../Reveal";

/**
 * "The life of one order" as a single horizontal strip: one line, five stops, a few words each.
 * Short on purpose. The story is the human review step, so it's the only stop in the accent color.
 */
const steps = [
  { label: "Photo in", tech: "Next.js" },
  { label: "Paid", tech: "Stripe" },
  { label: "AI draws", tech: "Gemini + OpenAI" },
  { label: "Human review", tech: "Custom Platform", highlight: true },
  { label: "Printed, mailed", tech: "Gelato + Prodigi" },
];

export function Architecture() {
  return (
    <Reveal className="w-full" threshold={0.35}>
      <p className="mb-5 text-xs uppercase tracking-[0.25em] text-ink-soft">The life of one order</p>
      <div className="relative">
        {/* the line draws left to right behind the dots */}
        <span
          aria-hidden
          className="grow-x absolute left-[10%] right-[10%] top-[7px] h-px bg-line"
          style={{ ["--d" as string]: "0ms" }}
        />
        <ol className="relative grid grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.label} className="flex flex-col items-center text-center">
              <span
                aria-hidden
                className={`pop block h-[15px] w-[15px] rounded-full border-2 ${
                  s.highlight ? "border-accent bg-accent" : "border-ink-soft/60 bg-paper"
                }`}
                style={{ ["--d" as string]: `${250 + i * 300}ms` }}
              />
              <span
                className={`step-in mt-3 px-1 font-serif text-[13px] leading-tight md:text-[15px] ${s.highlight ? "text-accent" : ""}`}
                style={{ ["--d" as string]: `${350 + i * 300}ms` }}
              >
                {s.label}
              </span>
              <span
                className="step-in mt-1 hidden px-1 text-[10px] uppercase tracking-[0.12em] text-ink-soft/70 md:block"
                style={{ ["--d" as string]: `${450 + i * 300}ms` }}
              >
                {s.tech}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
