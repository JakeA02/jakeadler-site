import { personal } from "@/content/site";
import { Photo } from "../Photo";
import { Reveal } from "../Reveal";

export function Personal() {
  return (
    <section id="personal" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">Outside work</p>
          <h2 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-tight">
            An avid traveler, dog lover, and adventurer.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {personal.map((p, i) => (
            <Reveal key={p.label} delay={i * 100} className={i % 2 ? "md:mt-12" : ""}>
              <Photo
                label={p.label}
                ratio={p.ratio}
                src={"src" in p ? p.src : undefined}
                tone={i % 3 === 0 ? "sage" : i % 3 === 1 ? "paper-deep" : "accent"}
                objectPosition={"objectPosition" in p ? p.objectPosition : p.label === "Traveler" ? "50% 35%" : undefined}
              />
              <p className="mt-3 font-serif text-lg">{p.label}</p>
              <p className="text-sm text-ink-soft">{p.caption}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
