/**
 * Single source of truth for copy, links, and disclosure choices.
 * Anything marked TODO is an open item to confirm before launch.
 */

export const site = {
  name: "Jake Adler",
  domain: "jakeadler.dev",
  email: "jakeadler02@gmail.com",
  // TODO: confirm LinkedIn URL.
  linkedin: "https://www.linkedin.com/in/adlerjake",
  github: "https://github.com/JakeA02",
  substack: {
    url: "https://thejakeadler.substack.com",
    feedUrl: "https://thejakeadler.substack.com/feed",
    pinnedUrl: "https://thejakeadler.substack.com/p/apples-ai-dormancy",
    pinnedTitle: "Apple's AI Dormancy",
    pinnedDate: "Mar 5, 2026",
    pinnedDek:
      "Apple has failed to integrate AI with the same speed and effectiveness as other tech companies — and time is running out.",
  },
};

/** Disclosure level: revenue and costs are public; profit shown as an all-time figure once ad spend is confirmed. */
export const disclosure = {
  showRevenue: true,
  showProfit: true,
  showAdSpend: true,
};

/** WebP assets in /public/images (sources kept alongside for now). */
export const images = {
  hero: {
    portrait: "/images/Hero-jake.webp",
    book: "/images/jake_and_dog.webp",
  },
  founder: {
    earlyPrototypes: "/images/early-prototypes.webp",
    diwali: "/images/Diwali-photos-linkedin-banner.webp",
    pitch: "/images/crowdfunded_pitch_night_group.webp",
    podcast: "/images/podcast.webp",
    talk: "/images/happycustomers.webp",
  },
};

export const hero = {
  eyebrow: "Jake Adler",
  title: "Ex-Founder. AI Builder.",
  subtitle: "Technology feels most magical when you can hold it.",
  line: "I spent a year building an AI children's book company as a solopreneur, then walked away. This is the whole story.",
};

export const headlineStats = [
  { label: "in revenue", value: 70000, prefix: "~$", suffix: "" },
  { label: "storybooks printed", value: 1700, prefix: "", suffix: "+" },
  { label: "customers", value: 1300, prefix: "", suffix: "+" },
];

export type Project = {
  name: string;
  /** Month the repo was started. */
  date: string;
  why: string;
  stack: string;
  href: string;
  live?: string;
  video?: string;
  /** WebP screenshot in /public/images/projects. Omit to use the project's illustrated tile. */
  image?: string;
  /** Backdrop behind the screenshot. */
  tone: "accent" | "sage" | "sand" | "ink";
};

/** Mirrors the six pinned repos on GitHub, newest first. Only public repos are named. */
export const projects: Project[] = [
  {
    name: "Eduardo Saverin",
    date: "Aug 2026",
    why: "Forecasts weekly US natural gas storage from the weather, then scores itself against the analyst consensus.",
    stack: "Python · LightGBM · GitHub Actions",
    href: "https://github.com/JakeA02/EduardoSaverin",
    live: "https://eduardo-saverin-rouge.vercel.app",
    image: "/images/projects/eduardo-saverin.webp",
    tone: "sage",
  },
  {
    name: "Save Money, Support Creators",
    date: "Dec 2025",
    why: "Every promo code buried in YouTube video descriptions, in one searchable place.",
    stack: "TypeScript · Python · Supabase",
    href: "https://github.com/JakeA02/SaveMoneySupportCreators",
    live: "https://savemoneysupportcreators.vercel.app",
    image: "/images/projects/savemoneysupportcreators.webp",
    tone: "accent",
  },
  {
    name: "All-In Ticker",
    date: "Sep 2025",
    why: "A stock ticker with pixel-art animation, because markets should be fun to watch.",
    stack: "TypeScript · VISX · Finnhub",
    href: "https://github.com/JakeA02/All-In-Ticker",
    live: "https://all-in-ticker.vercel.app",
    image: "/images/projects/allin-ticker.webp",
    tone: "sand",
  },
  {
    name: "Try-Me-On",
    date: "Aug 2025",
    why: "A Chrome extension that shows clothes on you, powered by Nano Banana.",
    stack: "Python · Chrome · Nano Banana",
    href: "https://github.com/JakeA02/try-me-on-extension",
    video: "https://www.youtube.com/watch?v=DM8rD3Qpv2Y",
    image: "/images/projects/try-me-on.webp",
    tone: "accent",
  },
  {
    name: "MyJarvis",
    date: "Apr 2025",
    why: "An AI secretary that phones you the news when you wake up.",
    stack: "Python · Twilio · ElevenLabs",
    href: "https://github.com/JakeA02/MyJarvis",
    tone: "ink",
  },
  {
    name: "Aila",
    date: "May 2024",
    why: "An early attempt at an AI tutor for high schoolers, with teacher oversight.",
    stack: "JavaScript · GPT-3.5 · Firebase",
    href: "https://github.com/JakeA02/Aila",
    image: "/images/projects/aila.webp",
    tone: "sage",
  },
];

export const personal = [
  {
    label: "Traveler",
    caption: "South America, mostly. I love using my limited Spanish.",
    ratio: "4/5",
    src: "/images/jake_travel.webp",
  },
  {
    label: "Bartender",
    caption: "Where I learned to be customer-first.",
    ratio: "1/1",
    src: "/images/bartending.webp",
    objectPosition: "50% 30%",
  },
  {
    label: "Dog-lover",
    caption: "This is Django. Django is the best.",
    ratio: "4/5",
    src: "/images/jake_and_dog.webp",
  },
  {
    label: "Scuba",
    caption: "My favorite activity on Earth.",
    ratio: "4/5",
    src: "/images/scuba.webp",
    objectPosition: "50% 40%",
  },
];

export const chapters = [
  {
    id: "idea",
    kicker: "Chapter 1",
    title: "The idea",
    body: "What if you could place kids in printed children's book with just one photo? In April 2025, image models were just getting good enough to make this possible. I made the first books for friends, using a full AI pipeline for both the writing and the illustrations.",
    caption: "Photo: early prototypes",
  },
  {
    id: "growth",
    kicker: "Chapter 2",
    title: "Zero to $70K",
    body: "AI-writing still outputted too much slop. And, I realized the real excitement — and the scalability — was in photo personalization. So I pivoted to templated, human-written stories starring each kid.",
    caption: "Photo: Cumulative revenue, Stripe",
  },
  {
    id: "diwali",
    kicker: "Chapter 3",
    title: "The Diwali spike",
    body: "Our Diwali storybook was the first ever human-illustrated, AI-personalized children's book. Brought to life with an Indian artist, it brought in about $40K in six weeks.",
    caption: "Photo: Daily sales, Sep to Oct 2026",
  },
  {
    id: "scale",
    kicker: "Chapter 4",
    title: "Scaling as one person",
    body: "I couldn't review every book myself, so I built a bespoke review platform and hired a small team. Review time dropped from ten minutes to ninety seconds per book.",
    caption: "Review time after the custom review platform",
  },
  {
    id: "economics",
    kicker: "Chapter 5",
    title: "Where every dollar went",
    body: "The honest version of the numbers. Seasonality, low repeat purchases, and unpredictable image output kept margins thin without an end in sight, so I decided to stop.",
    caption: "All time, August 2025 to today, per-dollar breakdown",
  },
  {
    id: "stage",
    kicker: "Chapter 6",
    title: "What I took with me",
    body: "I learned what it takes to build a business and how to design a product alongside customers. I also learned that distribution and sales matter as much as the product, perhaps even more so.",
    caption: "Photos: TomTom pitch night, podcast, happy customers",
  },
];

