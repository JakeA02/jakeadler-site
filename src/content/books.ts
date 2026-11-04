import sold from "@/data/books.json";

/**
 * Every title shipped under StorybookYou. Order counts and launch months come from real
 * first-sale data (src/data/books.json, via scripts/export_books.py), not code commit dates.
 * Art is copied from the storefront into /public/books so the site outlives the CDN.
 */
type Def = {
  slug: string;
  title: string;
  tag?: string;
  /** Firestore bookType values that roll up into this title. */
  types: string[];
  template: string;
  swap: string;
  /** Used only when a title has no sales yet. */
  launched?: string;
};

const defs: Def[] = [
  { slug: "princess-quest", title: "A Royal Night at the Castle", types: ["princess-quest"], template: "template.webp", swap: "swap.webp" },
  { slug: "easter", title: "The Great Easter Bunny Rescue", types: ["easter"], template: "template.webp", swap: "swap.webp" },
  { slug: "love-can-go", title: "As Far as Love Can Go", tag: "Mother's Day", types: ["mothers-day", "as-far-as-love-can-go"], template: "template.webp", swap: "swap.webp" },
  { slug: "revolutionary-war", title: "Revolutionary War Adventure", types: ["revolutionary-war"], template: "template.webp", swap: "swap.webp" },
  { slug: "big-hands", title: "Big Hands, Little Hands", tag: "Father's Day", types: ["fathers-day", "first-fathers-day", "big-hands-little-hands", "big-hands-little-hands-first-birthday"], template: "template.webp", swap: "swap.webp" },
  { slug: "build-a-road", title: "Builds a Road", types: ["build-a-road"], template: "template.webp", swap: "swap.webp" },
  { slug: "daytime-stars", title: "The Daytime Stars", types: ["daytime-stars"], template: "template.webp", swap: "swap.webp" },
  { slug: "dino-mac-mission", title: "The Mac 'n Cheese Mission", types: ["dino-mac-mission"], template: "template.webp", swap: "swap.webp" },
  { slug: "skeleton-sleepover", title: "Skeleton Sleepover", types: ["skeleton-sleepover"], template: "template.webp", swap: "swap.webp" },
  { slug: "diwali", title: "The Guiding Light of Diwali", types: ["diwali"], template: "template.webp", swap: "swap.webp" },
  { slug: "hanukkah", title: "The Lights of Hanukkah", types: ["hanukkah"], template: "template.jpg", swap: "swap.webp" },
];

type Sold = { bookType: string; firstSale: string; orders: number };

export type Book = {
  slug: string;
  title: string;
  tag?: string;
  template: string;
  swap: string;
  date: string;
  month: string;
  orders: number;
};

const fmtMonth = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export const books: Book[] = defs
  .map((d) => {
    const rows = (sold as Sold[]).filter((s) => d.types.includes(s.bookType));
    const date = rows.length ? rows.map((r) => r.firstSale).sort()[0] : d.launched!;
    return {
      slug: d.slug,
      title: d.title,
      tag: d.tag,
      template: `/books/${d.slug}/${d.template}`,
      swap: `/books/${d.slug}/${d.swap}`,
      date,
      month: fmtMonth(date),
      orders: rows.reduce((n, r) => n + r.orders, 0),
    };
  })
  .sort((a, b) => a.date.localeCompare(b.date));
