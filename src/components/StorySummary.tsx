import Image from "next/image";
import { books } from "@/content/books";
import { chapters, images } from "@/content/site";
import { snapshot, stripe, diwaliRevenue, money } from "@/lib/data";
import { Reveal } from "./Reveal";
import { RevenueSpark } from "./charts/RevenueSpark";

const FEATURED = ["love-can-go", "dino-mac-mission", "diwali"];

function Tile({
  to,
  className = "",
  delay = 0,
  children,
}: {
  to: string;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const c = chapters.find((ch) => ch.id === to)!;
  return (
    <Reveal delay={delay} className={className}>
      <a
        href={`#${to}`}
        className="group flex h-full flex-col rounded-[8px] border border-line bg-paper-deep/50 p-6 transition hover:border-ink-soft"
      >
        <div className="flex-1">{children}</div>
        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ink-soft transition group-hover:text-accent">
          {c.kicker} · {c.title} <span aria-hidden>→</span>
        </p>
      </a>
    </Reveal>
  );
}

export function StorySummary() {
  const t = snapshot.totals;
  const covers = FEATURED.map((slug) => books.find((b) => b.slug === slug)!).filter(Boolean);

  return (
    <div className="mx-auto mt-14 grid max-w-6xl gap-4 px-6 md:grid-cols-3">
      <Tile to="idea" className="md:col-span-2">
        <p className="font-serif text-2xl leading-snug md:text-3xl">One photo in. A printed book starring your kid out.</p>
        <ul className="mt-6 grid grid-cols-3 gap-3">
          {covers.map((b, i) => (
            <li key={b.slug} className="relative aspect-square overflow-hidden rounded-[6px] border border-line bg-paper">
              <Image src={b.template} alt="" fill sizes="(max-width:768px) 30vw, 200px" className="object-contain" />
              <Image
                src={b.swap}
                alt={`${b.title}, personalized cover`}
                fill
                sizes="(max-width:768px) 30vw, 200px"
                className="book-swap object-contain"
                style={{ ["--i" as string]: i * 2 }}
              />
            </li>
          ))}
        </ul>
      </Tile>

      <Tile to="economics" delay={90}>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Cumulative revenue</p>
        <p className="mt-2 font-serif text-2xl">Slowly, then all at once.</p>
        <div className="mt-6">
          <RevenueSpark />
        </div>
        <p className="mt-2 text-sm text-ink-soft">{money(stripe.gross)} from Aug 2025 to Oct 2026.</p>
      </Tile>

      <Tile to="diwali" delay={180}>
        <p className="font-serif text-5xl">{money(diwaliRevenue)}</p>
        <p className="mt-1 text-sm text-ink-soft">in six weeks from one Diwali book, more than the rest of the year combined.</p>
        <div className="relative mt-6 aspect-[4/1] overflow-hidden rounded-[6px] border border-line bg-paper">
          <Image src={images.founder.diwali} alt="Diwali book spread" fill sizes="(max-width:768px) 90vw, 360px" className="object-cover" />
        </div>
      </Tile>

      <Tile to="stopped" className="md:col-span-2" delay={270}>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Why I stopped</p>
        <p className="mt-2 font-serif text-2xl leading-snug md:text-3xl">
          About {money(t.profit)} left over after printing, AI, fees, and ads.
        </p>
        <p className="mt-4 max-w-xl text-ink-soft">
          Sales were seasonal, few families bought twice, and image generation was never fully predictable. Margins were
          going to stay thin, so I shut it down.
        </p>
      </Tile>
    </div>
  );
}
