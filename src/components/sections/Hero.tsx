import { hero, images } from "@/content/site";
import { Photo } from "../Photo";

export function Hero() {
  return (
    <section className="mx-auto grid min-h-[92vh] max-w-6xl items-center gap-10 px-6 pb-16 pt-24 md:grid-cols-[1.2fr_1fr] md:py-24">
      <div>
        <p className="mb-6 hidden text-xs uppercase tracking-[0.25em] text-ink-soft md:block">{hero.eyebrow}</p>
        <h1 className="font-serif text-[clamp(2.8rem,8vw,6rem)] leading-[0.98] tracking-tight">{hero.title}</h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">{hero.line}</p>
        <a href="#founder" className="mt-10 inline-flex items-center gap-2 text-sm text-ink-soft transition hover:text-ink">
          See my work <span aria-hidden>↓</span>
        </a>
      </div>
      <div className="relative mx-auto w-full max-w-sm md:max-w-none">
        <Photo label="Portrait of Jake" ratio="4/5" src={images.hero.portrait} className="w-full" objectPosition="50% 20%" />
        <Photo
          label="Jake tabling in Central Park"
          ratio="1/1"
          src={images.hero.book}
          className="absolute -bottom-8 -left-6 hidden w-2/5 rotate-[-3deg] shadow-lg md:block"
        />
      </div>
    </section>
  );
}
