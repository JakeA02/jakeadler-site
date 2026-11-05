import { site } from "@/content/site";
import { Reveal } from "../Reveal";
import { CopyEmail } from "../CopyEmail";

export function Contact() {
  return (
    <section id="contact" className="border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <Reveal>
          <h2 className="font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-none">Say hello.</h2>
          <p className="mt-6 max-w-lg text-lg text-paper/70">
            Building something AI-related? I&apos;d love to hear about it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href={`mailto:${site.email}`} className="rounded-full bg-paper px-6 py-3 text-sm text-ink transition hover:bg-accent hover:text-paper">
              {site.email}
            </a>
            <CopyEmail email={site.email} />
            <a href={site.linkedin} className="text-sm underline underline-offset-4 hover:text-accent">LinkedIn</a>
            <a href={site.github} className="text-sm underline underline-offset-4 hover:text-accent">GitHub</a>
            <a href={site.resume} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4 hover:text-accent">Resume</a>
          </div>
        </Reveal>
        <p className="mt-24 text-xs text-paper/40">© 2026 Jake Adler · New York</p>
      </div>
    </section>
  );
}
