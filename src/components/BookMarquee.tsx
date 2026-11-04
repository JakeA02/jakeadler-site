"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { books, type Book } from "@/content/books";

/**
 * Slow autoscroll of every title, with prev/next, drag, and swipe on top.
 * Each cover rests on the blank template, then fades to the personalized
 * "character swap" — the same 5s hold / 0.7s fade the storefront cards use.
 */
function Card({ b, i, hidden = false }: { b: Book; i: number; hidden?: boolean }) {
  return (
    <li className="book-card w-[140px] shrink-0 pr-4 md:w-[164px]" aria-hidden={hidden || undefined}>
      <div className="relative aspect-square overflow-hidden rounded-[6px] border border-line bg-paper-deep">
        <Image
          src={b.template}
          alt={hidden ? "" : `${b.title}, blank template cover`}
          fill
          sizes="164px"
          loading="eager"
          draggable={false}
          className="pointer-events-none object-contain"
        />
        <Image
          src={b.swap}
          alt={hidden ? "" : `${b.title}, personalized cover`}
          fill
          sizes="164px"
          loading="eager"
          draggable={false}
          className="book-swap pointer-events-none object-contain"
          style={{ ["--i" as string]: i }}
        />
      </div>
      <p className="mt-2 line-clamp-2 min-h-[2.4em] font-serif text-[14px] leading-tight">{b.title}</p>
      <p className="mt-0.5 text-[11px] text-ink-soft">
        {b.month}
      </p>
    </li>
  );
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const prev = dir === "prev";
  return (
    <button
      type="button"
      aria-label={prev ? "Previous titles" : "Next titles"}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink/25 hover:bg-paper-deep hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={prev ? "M15 6 9 12l6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

const LOOP_MS = 80_000;
const RESUME_MS = 2_800;

export function BookMarquee() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const focused = useRef(false);
  const dragging = useRef(false);
  const resumeAt = useRef(0);
  const drag = useRef({ x: 0, left: 0 });

  const pauseFor = useCallback((ms = RESUME_MS) => {
    resumeAt.current = performance.now() + ms;
  }, []);

  const halfWidth = () => {
    const el = scrollerRef.current;
    return el ? el.scrollWidth / 2 : 0;
  };

  const wrap = useCallback((allowBack = false) => {
    const el = scrollerRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    if (half < 2) return;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    else if (allowBack && el.scrollLeft <= 0) el.scrollLeft += half;
  }, []);

  const step = useCallback(
    (dir: -1 | 1) => {
      const el = scrollerRef.current;
      if (!el) return;
      pauseFor();
      const card = el.querySelector("li");
      const w = card?.getBoundingClientRect().width ?? 164;
      const half = halfWidth();
      if (dir < 0 && el.scrollLeft < w) el.scrollLeft += half;
      else if (dir > 0 && el.scrollLeft > half - w) el.scrollLeft -= half;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollBy({ left: dir * w, behavior: reduce ? "auto" : "smooth" });
    },
    [pauseFor],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      const paused =
        reduce.matches || hovering.current || focused.current || dragging.current || now < resumeAt.current;
      if (!paused) {
        const half = el.scrollWidth / 2;
        if (half > 2) el.scrollLeft += (half / LOOP_MS) * dt;
        wrap();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [wrap]);

  return (
    <div
      className="mt-10"
      onPointerEnter={() => {
        hovering.current = true;
      }}
      onPointerLeave={() => {
        hovering.current = false;
      }}
      onFocusCapture={() => {
        focused.current = true;
      }}
      onBlurCapture={(e) => {
        focused.current = e.currentTarget.contains(e.relatedTarget as Node);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        }
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-line pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">
            {books.length} titles, oldest to newest
          </p>
          <p className="mt-1 text-[11px] italic text-ink-soft/80">Template, then your child.</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Arrow dir="prev" onClick={() => step(-1)} />
          <Arrow dir="next" onClick={() => step(1)} />
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="book-marquee"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          const el = scrollerRef.current;
          if (!el) return;
          dragging.current = true;
          drag.current = { x: e.clientX, left: el.scrollLeft };
          el.classList.add("is-dragging");
          el.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const el = scrollerRef.current;
          if (!el) return;
          el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
          const half = el.scrollWidth / 2;
          if (half < 2) return;
          if (el.scrollLeft >= half) {
            el.scrollLeft -= half;
            drag.current.left -= half;
          } else if (el.scrollLeft < 0) {
            el.scrollLeft += half;
            drag.current.left += half;
          }
        }}
        onPointerUp={() => {
          if (!dragging.current) return;
          dragging.current = false;
          scrollerRef.current?.classList.remove("is-dragging");
          pauseFor();
        }}
        onPointerCancel={() => {
          dragging.current = false;
          scrollerRef.current?.classList.remove("is-dragging");
        }}
        onWheel={(e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) pauseFor();
        }}
        onTouchStart={() => pauseFor()}
      >
        <ul className="book-track" aria-label="Every StorybookYou title, oldest to newest">
          {books.map((b, i) => (
            <Card key={b.slug} b={b} i={i} />
          ))}
          {books.map((b, i) => (
            <Card key={`${b.slug}-dup`} b={b} i={i} hidden />
          ))}
        </ul>
      </div>
    </div>
  );
}
