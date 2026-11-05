"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Summary first, chapters collapsed below. Opens from the CTA, a tile linking to a
 * chapter (#id), or a deep link. Chapters stay in the DOM (inert when closed) for SEO.
 */
export function StoryExpander({
  ids,
  anchor,
  summary,
  children,
}: {
  ids: string[];
  anchor: string;
  summary: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(true);
  const openRef = useRef(false);
  const pending = useRef<string | null>(null);

  const flush = useCallback(() => {
    const id = pending.current;
    pending.current = null;
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }, []);

  const openTo = useCallback(
    (id: string, withMotion: boolean) => {
      pending.current = id;
      if (openRef.current) return flush();
      openRef.current = true;
      setAnimate(withMotion);
      setOpen(true);
      if (withMotion) window.setTimeout(flush, 900);
    },
    [flush],
  );

  useEffect(() => {
    if (open && !animate) flush();
  }, [open, animate, flush]);

  useEffect(() => {
    const fromHash = (withMotion: boolean) => {
      const id = location.hash.slice(1);
      if (ids.includes(id) && !openRef.current) openTo(id, withMotion);
    };
    fromHash(false);
    const onHash = () => fromHash(!reducedMotion());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [ids, openTo]);

  const collapse = () => {
    const motion = !reducedMotion();
    document.getElementById(anchor)?.scrollIntoView({ behavior: motion ? "smooth" : "auto", block: "start" });
    window.setTimeout(
      () => {
        openRef.current = false;
        setAnimate(motion);
        setOpen(false);
        history.replaceState(null, "", location.pathname + location.search);
      },
      motion ? 500 : 0,
    );
  };

  const toggle = (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="story-chapters"
      onClick={() => (open ? collapse() : openTo(ids[0], !reducedMotion()))}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-accent"
    >
      {open ? "Collapse the story" : "Read the full story"}
      <span aria-hidden className={`transition-transform duration-500 ${open ? "rotate-180" : ""}`}>↓</span>
    </button>
  );

  return (
    <>
      <div
        onClickCapture={(e) => {
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
          const id = a?.getAttribute("href")?.slice(1);
          if (!id || !ids.includes(id) || openRef.current) return;
          e.preventDefault();
          openTo(id, !reducedMotion());
        }}
      >
        {summary}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl justify-center px-6">{toggle}</div>

      <div
        id="story-chapters"
        inert={!open}
        className={`grid ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} ${
          animate ? "transition-[grid-template-rows] duration-700 ease-[var(--ease)]" : ""
        }`}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && open) flush();
        }}
      >
        <div className="min-h-0 overflow-hidden">
          {children}
          <div className="mx-auto flex max-w-6xl justify-center px-6 pb-24">{open ? toggle : null}</div>
        </div>
      </div>
    </>
  );
}
