"use client";

import { useEffect, useRef, useState } from "react";

/** Adds `.in` once the element scrolls into view. Charts and reveals key off it. */
export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  threshold = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "li";
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
