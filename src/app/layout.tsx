import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "Jake Adler";
const description =
  "Founder, AI builder, product-design lover. The story of building StorybookYou as a solopreneur, told with the real numbers.";
const ogDescription = "A year building an AI children's book company as a solopreneur, and closing it on purpose.";

export const viewport: Viewport = {
  themeColor: "#f6f1e7",
};

export const metadata: Metadata = {
  title,
  description,
  applicationName: title,
  authors: [{ name: title, url: "https://jakeadler.dev" }],
  creator: title,
  metadataBase: new URL("https://jakeadler.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: ogDescription,
    url: "https://jakeadler.dev",
    siteName: title,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: ogDescription,
  },
  appleWebApp: {
    title,
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
