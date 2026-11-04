import Image from "next/image";
import { site } from "@/content/site";
import { Reveal } from "../Reveal";
import { SideProjects } from "../SideProjects";

type Post = {
  title: string;
  link: string;
  date: string;
  description: string;
  image?: string;
};

function normalizePostUrl(url: string) {
  return url.replace(/\/$/, "");
}

function parseFeedItem(item: string): Post {
  const pick = (tag: string) =>
    (item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1] ?? "").trim();
  const enclosure = item.match(/<enclosure url="([^"]+)"/)?.[1]?.trim();
  return {
    title: pick("title"),
    link: pick("link"),
    description: pick("description"),
    image: enclosure || undefined,
    date: new Date(pick("pubDate")).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

async function getFeed(): Promise<Post[]> {
  try {
    const res = await fetch(site.substack.feedUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => parseFeedItem(item));
  } catch {
    return [];
  }
}

function substackImageUrl(image: string, width: number) {
  if (image.includes("substackcdn.com")) return image;
  const encoded = encodeURIComponent(image);
  return `https://substackcdn.com/image/fetch/w_${width},c_fill,f_auto,q_auto:good/${encoded}`;
}

export async function Writer() {
  const feed = await getFeed();
  const s = site.substack;
  const pinnedUrl = normalizePostUrl(s.pinnedUrl);
  const pinnedFromFeed = feed.find((p) => normalizePostUrl(p.link) === pinnedUrl);
  const pinnedImage = pinnedFromFeed?.image;
  const pinnedDate = pinnedFromFeed?.date ?? s.pinnedDate;
  const latest = feed.filter((p) => normalizePostUrl(p.link) !== pinnedUrl).slice(0, 5);

  return (
    <section id="writer" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">The writer</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-tight">What I think about when I&apos;m not building.</h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <a
              href={s.pinnedUrl}
              className="group block overflow-hidden rounded-[8px] border border-line bg-paper-deep/50 transition hover:border-ink-soft"
            >
              {pinnedImage ? (
                <div className="relative aspect-[16/9] border-b border-line bg-paper-deep">
                  <Image
                    src={substackImageUrl(pinnedImage, 900)}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 55vw"
                    priority
                  />
                </div>
              ) : null}
              <div className="p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-accent">Pinned</p>
                <h3 className="mt-3 font-serif text-3xl leading-snug group-hover:underline decoration-accent underline-offset-4 md:text-4xl">
                  {s.pinnedTitle}
                </h3>
                <p className="mt-2 text-xs text-ink-soft">{pinnedDate}</p>
                <p className="mt-4 text-ink-soft">{s.pinnedDek}</p>
                <p className="mt-6 text-sm">Read on Substack →</p>
              </div>
            </a>
          </Reveal>
          <Reveal delay={120}>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ink-soft">Latest</p>
            {latest.length ? (
              <ul className="divide-y divide-line border-y border-line">
                {latest.map((p) => (
                  <li key={p.link}>
                    <a href={p.link} className="group flex gap-4 py-4 hover:text-accent">
                      {p.image ? (
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[4px] border border-line bg-paper-deep">
                          <Image
                            src={substackImageUrl(p.image, 240)}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      ) : null}
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="font-serif text-lg leading-snug">{p.title}</span>
                        <span className="text-xs text-ink-soft">{p.date}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="border-y border-line py-6 text-sm text-ink-soft">
                Latest posts appear here once the Substack feed is reachable.
              </p>
            )}
            <a href={s.url} className="mt-4 inline-block text-sm text-ink-soft hover:text-accent">
              All posts on Substack →
            </a>
          </Reveal>
        </div>

        <SideProjects />
      </div>
    </section>
  );
}
