/** Labeled placeholder. Swap `src` in when real photos arrive; layout keeps its ratio. */
import Image from "next/image";

export function Photo({
  label,
  ratio = "4/5",
  src,
  alt = "",
  className = "",
  tone = "paper-deep",
  objectPosition = "50% 50%",
  fit = "cover",
  priority = false,
  quality,
}: {
  label: string;
  ratio?: string;
  src?: string;
  alt?: string;
  className?: string;
  tone?: "paper-deep" | "accent" | "sage";
  objectPosition?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  quality?: number;
}) {
  const bg =
    tone === "accent" ? "bg-accent/15" : tone === "sage" ? "bg-sage/15" : "bg-paper-deep";
  return (
    <figure
      className={`relative overflow-hidden rounded-[6px] border border-line ${bg} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || label}
          fill
          priority={priority}
          quality={quality}
          className={fit === "contain" ? "object-contain" : "object-cover"}
          style={{ objectPosition }}
          sizes="(max-width:768px) 90vw, 40vw"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft/70">Photo placeholder</span>
          <span className="font-serif text-sm italic text-ink-soft">{label}</span>
          <span className="text-[10px] text-ink-soft/60">{ratio.replace("/", ":")}</span>
        </div>
      )}
    </figure>
  );
}
