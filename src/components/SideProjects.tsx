import Image from "next/image";
import { projects, type Project } from "@/content/site";
import { Reveal } from "./Reveal";

const toneClass: Record<Project["tone"], string> = {
  accent: "bg-accent",
  sage: "bg-sage",
  sand: "bg-paper-deep",
  ink: "bg-ink",
};

function Screenshot({ p, image }: { p: Project; image: string }) {
  return (
    <div className="absolute left-[9%] top-[12%] w-[100%] overflow-hidden rounded-tl-[6px] shadow-[0_18px_40px_-16px_rgba(31,27,22,0.7)] ring-1 ring-black/10 transition-transform duration-700 ease-[var(--ease)] group-hover:-translate-x-[3%] group-hover:-translate-y-[4%]">
      {p.video ? null : (
        <div className="flex h-4 items-center gap-1 bg-[#2a2622] px-2" aria-hidden>
          <span className="size-1.5 rounded-full bg-paper/30" />
          <span className="size-1.5 rounded-full bg-paper/30" />
          <span className="size-1.5 rounded-full bg-paper/30" />
        </div>
      )}
      <div className="relative aspect-[16/10] bg-ink">
        <Image
          src={image}
          alt={`${p.name} screenshot`}
          fill
          className="object-cover object-left-top"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {p.video ? (
          <span className="absolute left-[38%] top-[42%] flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/80 text-paper shadow-lg transition duration-500 group-hover:scale-110 group-hover:bg-accent">
            <svg viewBox="0 0 24 24" className="ml-0.5 size-5 fill-current" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Illustrated tile for projects without a screenshot: Jarvis calling with your morning briefing. */
function IncomingCall() {
  return (
    <div className="absolute left-1/2 top-[12%] w-[40%] -translate-x-1/2 rounded-t-[22px] border border-paper/15 bg-[#2a2622] px-4 pb-10 pt-6 text-center text-paper shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-[var(--ease)] group-hover:-translate-y-[6%]">
      <p className="text-[9px] uppercase tracking-[0.2em] text-paper/50">Incoming call</p>
      <div className="relative mx-auto mt-4 size-11">
        <span className="call-ring absolute inset-0 rounded-full bg-sage/60" />
        <span className="call-ring absolute inset-0 rounded-full bg-sage/60 [animation-delay:1s]" />
        <span className="relative flex size-full items-center justify-center rounded-full bg-sage font-serif text-lg">
          J
        </span>
      </div>
      <p className="mt-3 font-serif text-lg leading-none">Jarvis</p>
      <p className="mt-1.5 text-[10px] text-paper/60">Your 7:00 AM briefing</p>
      <div className="mt-5 flex justify-center gap-5" aria-hidden>
        <span className="size-6 rounded-full bg-accent" />
        <span className="size-6 rounded-full bg-sage" />
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const primary = p.live ?? p.video ?? p.href;
  const links = [
    p.live && { label: "Live site", href: p.live },
    p.video && { label: "Watch demo", href: p.video },
    { label: "Code", href: p.href },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <article className="group flex h-full flex-col">
      <a
        href={primary}
        aria-label={`${p.name}: ${links[0].label}`}
        className={`relative block aspect-[16/11] overflow-hidden rounded-[8px] ${toneClass[p.tone]}`}
      >
        {p.image ? <Screenshot p={p} image={p.image} /> : <IncomingCall />}
      </a>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl leading-snug">
          <a href={primary} className="hover:text-accent">
            {p.name}
          </a>
        </h3>
        <time className="shrink-0 text-[11px] uppercase tracking-wider text-ink-soft/80">{p.date}</time>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.why}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {p.stack.split(" · ").map((s) => (
          <li
            key={s}
            className="rounded-full border border-line px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-ink-soft"
          >
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex gap-5 pt-5 text-sm">
        {links.map((l) => (
          <a key={l.label} href={l.href} className="text-ink hover:text-accent">
            {l.label} <span aria-hidden>↗</span>
          </a>
        ))}
      </div>
    </article>
  );
}

export function SideProjects() {
  return (
    <div className="mt-24">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">Side projects</p>
      </Reveal>
      <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.name} delay={(i % 3) * 90} threshold={0.15}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
