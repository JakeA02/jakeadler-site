import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Founder } from "@/components/sections/Founder";
import { Writer } from "@/components/sections/Writer";
import { Personal } from "@/components/sections/Personal";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Founder />
      <Writer />
      <Personal />
      <Contact />
    </main>
  );
}
