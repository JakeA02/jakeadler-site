import { chapters, headlineStats, images } from "@/content/site";
import { snapshot, stripe, diwaliRevenue, money } from "@/lib/data";
import { CountUp } from "../CountUp";
import { Photo } from "../Photo";
import { BookMarquee } from "../BookMarquee";
import { Reveal } from "../Reveal";
import { RevenueChart } from "../charts/RevenueChart";
import { DiwaliChart } from "../charts/DiwaliChart";
import { Waterfall } from "../charts/Waterfall";
import { StoryExpander } from "../StoryExpander";
import { StorySummary } from "../StorySummary";

function Chapter({ id, children, flip = false }: { id: string; children: React.ReactNode; flip?: boolean }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className={`grid gap-10 md:gap-16 ${flip ? "md:grid-cols-[1.3fr_1fr]" : "md:grid-cols-[1fr_1.3fr]"}`}>{children}</div>
    </section>
  );
}

function Text({ i }: { i: number }) {
  const c = chapters[i];
  return (
    <Reveal className="md:sticky md:top-24 md:self-start">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">{c.kicker}</p>
      <h3 className="font-serif text-4xl leading-tight md:text-5xl">{c.title}</h3>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">{c.body}</p>
    </Reveal>
  );
}

function Caption({ i }: { i: number }) {
  return <p className="mt-4 text-xs italic text-ink-soft/80">{chapters[i].caption}</p>;
}

export function Founder() {
  return (
    <div id="founder" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 pt-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">The founder years</p>
          <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.05]">
            StorybookYou: an AI-personalized children&apos;s book company
          </h2>
        </Reveal>
        <dl className="snap-row mt-14 gap-3 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
          {headlineStats.map((s) => (
            <div key={s.label} className="rounded-[8px] border border-line bg-paper-deep/50 p-6 md:bg-transparent md:p-0 md:border-0 md:border-t md:pt-4">
              <dd className="font-serif text-5xl md:text-6xl"><CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} /></dd>
              <dt className="mt-1 text-sm text-ink-soft">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <StoryExpander ids={chapters.map((c) => c.id)} anchor="founder" summary={<StorySummary />}>
        <Chapters />
      </StoryExpander>
    </div>
  );
}

function Chapters() {
  const t = snapshot.totals;
  return (
    <>
      <Chapter id="idea">
        <Text i={0} />
        <div className="min-w-0">
          <BookMarquee />
        </div>
      </Chapter>

      <Chapter id="pivot" flip>
        <Text i={1} />
        <Reveal>
          <Photo label="Early prototypes" ratio="4/3" src={images.founder.earlyPrototypes} />
          <Caption i={1} />
        </Reveal>
      </Chapter>

      <Chapter id="customers">
        <Text i={2} />
        <Reveal>
          <Photo label="Families reading StorybookYou" ratio="3/2" src={images.founder.talk} />
          <Caption i={2} />
        </Reveal>
      </Chapter>

      <Chapter id="diwali" flip>
        <Text i={3} />
        <div>
          <DiwaliChart />
          <p className="mt-4 font-serif text-2xl italic">{money(diwaliRevenue)} in six weeks.</p>
          <Caption i={3} />
          <Reveal className="mt-8">
            <Photo
              label="Diwali book spread"
              ratio="4/1"
              src={images.founder.diwali}
              fit="contain"
            />
          </Reveal>
        </div>
      </Chapter>

      <Chapter id="economics">
        <Text i={4} />
        <div className="min-w-0 space-y-12">
          <div>
            <RevenueChart />
            <p className="mt-4 text-sm text-ink-soft">
              {money(stripe.gross)} across {t.orders.toLocaleString()} orders.
            </p>
          </div>
          <div>
            <Waterfall />
            <p className="mt-4 font-serif text-2xl italic">About {money(t.profit)} left over after everything.</p>
            <Caption i={4} />
          </div>
        </div>
      </Chapter>

      <Chapter id="stopped" flip>
        <Text i={5} />
        <Reveal>
          <div className="grid grid-cols-2 gap-3">
            <Photo label="Crowdfund pitch night" ratio="4/5" src={images.founder.pitch} />
            <Photo label="Podcast recording" ratio="4/5" tone="sage" src={images.founder.podcast} />
          </div>
          <Caption i={5} />
        </Reveal>
      </Chapter>
    </>
  );
}
