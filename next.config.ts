import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // next/image caches optimized files by URL for 4 hours and never
    // invalidates them. Replacing a photo in /public/images keeps the same
    // path, so local swaps/rotations stay invisible until the cache expires.
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "substack-post-media.s3.amazonaws.com",
        pathname: "/public/images/**",
      },
      {
        protocol: "https",
        hostname: "substackcdn.com",
        pathname: "/image/fetch/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
