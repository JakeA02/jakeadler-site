import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Jake Adler",
  description:
    "Founder, AI builder, product-design lover. The story of building StorybookYou as a solopreneur, told with the real numbers.",
  metadataBase: new URL("https://jakeadler.dev"),
  openGraph: {
    title: "Jake Adler",
    description: "A year building an AI children's book company as a solopreneur, and closing it on purpose.",
    url: "https://jakeadler.dev",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
