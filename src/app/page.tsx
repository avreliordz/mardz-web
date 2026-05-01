import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Experience } from "@/components/sections/Experience";
import { Work } from "@/components/sections/Work";
import { Speaking } from "@/components/sections/Speaking";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Work />
      <Capabilities />
      <Speaking />
      <Contact />
    </>
  );
}
