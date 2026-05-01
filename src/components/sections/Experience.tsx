"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const entries = [
  {
    range: "2013–2015",
    org: "Freelance Professional",
    role: "Independent Web Developer",
    quote:
      "I began offering my professional services working on small business websites and small e-commerce integrations.",
  },
  {
    range: "2017–2019",
    org: "Butchershop MX",
    role: "UX/UI Designer (Entry Level to Medium Level)",
    quote:
      "At Butchershop I had the opportunity to refine my expertise towards UX/UI Design and Design Thinking. I joined the team",
  },
  {
    range: "2019–2025",
    org: "Wizeline Services",
    role: "Product Designer - (Senior Level to Lead Designer)",
    quote:
      "I consider Wizeline my biggest professional leap since I collaborated with Fortune 500 companies and very promising, well-backed startups. I started as a Level II designer and by my 4th year I was leader, mentor and tutor at Wizeline Academy.",
  },
  {
    range: "2025–Present Day",
    org: "Interact Studio",
    role: "Lead Product Developer",
    quote:
      "Today at Interact, I'm leading robust efforts from Hypothesis Validation, User Research to Venture Building.",
  },
] as const;

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 25%"],
  });
  const pathProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
  });

  return (
    <section
      id="experience"
      className="bg-black px-5 py-24 md:px-8"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <ScrollReveal>
          <p className="font-mono-label text-smoke">§ 05</p>
          <h2 id="experience-heading" className="section-title mt-4 text-paper">
            Experience
          </h2>
        </ScrollReveal>

        <div ref={ref} className="relative mt-16">
          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block">
            <svg
              className="mb-10 h-12 w-full text-graphite"
              viewBox="0 0 1200 48"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.path
                d="M 0 24 L 1200 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                style={{ pathLength: pathProgress }}
              />
            </svg>
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
              {entries.map((e) => (
                <div key={e.range} className="border-l border-graphite pl-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-ash">
                    {e.range}
                  </p>
                  <p className="mt-3 font-display text-lg text-paper">{e.org}</p>
                  <p className="mt-2 text-sm font-medium leading-snug text-paper/90">
                    {e.role}
                  </p>
                  <p className="mt-3 border-l border-graphite/40 pl-3 text-sm italic leading-relaxed text-fog">
                    {e.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="relative space-y-10 md:hidden">
            <svg
              className="absolute left-0 top-0 h-full w-4 overflow-visible"
              viewBox="0 0 4 400"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.path
                d="M 2 0 L 2 400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-graphite"
                style={{ pathLength: pathProgress }}
              />
            </svg>
            {entries.map((e) => (
              <div key={e.range} className="relative pl-10">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-paper" />
                <p className="font-mono text-xs uppercase tracking-widest text-ash">
                  {e.range}
                </p>
                <p className="mt-2 font-display text-xl text-paper">{e.org}</p>
                <p className="mt-1 text-sm font-medium leading-snug text-paper/90">
                  {e.role}
                </p>
                <p className="mt-3 border-l border-graphite/40 pl-3 text-sm italic leading-relaxed text-fog">
                  {e.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
