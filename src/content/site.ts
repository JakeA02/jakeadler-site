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
  resume: "https://drive.google.com/file/d/1bidhmWDni5Ex6W329tr5RkqYuA4jiFnX/view?usp=sharing",
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
    portrait: "/images/new-hero.webp",
    book: "/images/tabling-in-central-park.webp",
  },
  founder: {
    earlyPrototypes: "/images/early-prototypes.webp",
    diwali: "/images/Diwali-photos-linkedin-banner.webp",
    pitch: "/images/crowdfunded_pitch_night_group.webp",
    podcast: "/images/podcast.webp",
    talk: "/images/happycustomers.webp",
    tabling: "/images/central-park-tabling.webp",
  },
};

export const hero = {
  eyebrow: "Jake Adler",
  title: "Ex-Founder. AI Builder.",
  line: "I build AI products people can hold and use. Before this, I ran StorybookYou on my own for a year. Here's what I learned, what I'm building now, and what I'm thinking about.",
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
    ratio: "4/5",
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
    body: "Technology feels most magical when you can hold it. So what if one photo could put a kid inside a printed children's book? In April 2025, image models were just getting good enough to make that possible.",
    caption: "Every title, from blank template to personalized cover",
  },
  {
    id: "pivot",
    kicker: "Chapter 2",
    title: "The pivot",
    body: "I made the first books for friends using a fully AI pipeline for both the writing and the illustrations, and started selling in August 2025. But the AI writing kept coming out sloppy, and the real magic (and the scalability) was in kids seeing themselves on the page. So I pivoted to human-written story templates and personalized each book for the child.",
    caption: "The first full-AI prototypes, before the pivot",
  },
  {
    // TODO: confirm the distribution details (Meta as the main channel, the gift-moment framing).
    id: "customers",
    kicker: "Chapter 3",
    title: "Finding customers",
    body: "The next (and most uncomfortable) step was finding customers. I started by tabling in Central Park and running Meta ads, and the ads became the main driver of sales, especially when timed around gift-giving moments. Mother's Day and Father's Day were the first real spikes. In total, more than 1,300 families have ordered, and we've shipped books across North America, Europe, and Asia.",
    caption: "Tabling in Central Park, and families reading their StorybookYou storybooks",
  },
  {
    id: "diwali",
    kicker: "Chapter 4",
    title: "The Diwali spike",
    body: "Our Diwali storybook was the first ever human-illustrated, AI-personalized book. We collaborated with an Indian artist. It brought in about $40K in six weeks, more than the rest of the year combined.",
    caption: "Daily sales, Sep 17 to Oct 31, 2026",
  },
  {
    id: "economics",
    kicker: "Chapter 5",
    title: "Where every dollar went",
    body: "The whole year in two charts: cumulative revenue, then what printing, AI, payment fees, and ads took out of it.",
    caption: "All time, August 2025 to today. Revenue from Stripe.",
  },
  {
    id: "stopped",
    kicker: "Chapter 6",
    title: "Why I stopped",
    body: "Sales were seasonal, few families bought twice, and image generation was never fully predictable. I also missed working on a team. Margins were going to stay thin, so I shut it down. I left knowing how to build a business, how to design a product alongside customers, and that distribution matters as much as the product, maybe more.",
    caption: "Photos: TomTom pitch night, podcast",
  },
];

