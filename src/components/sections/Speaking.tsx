"use client";

import { speakingEvents } from "@/data/speaking";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Speaking() {
  return (
    <section
      id="speaking"
      className="border-t border-graphite bg-black px-5 py-24 md:px-8"
      aria-labelledby="speaking-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <ScrollReveal>
          <p className="font-mono-label text-smoke">§ 06</p>
          <h2 id="speaking-heading" className="section-title mt-4 text-paper">
            Speaking &amp; community
          </h2>
        </ScrollReveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {speakingEvents.map((ev, i) => (
            <ScrollReveal key={`${ev.year}-${ev.title}`} delay={i * 0.05}>
              <li className="group border border-graphite bg-carbon/40 p-6 transition-colors hover:border-fog/40">
                <p className="font-mono text-3xl text-paper">{ev.year}</p>
                <p className="mt-4 font-display text-xl text-fog group-hover:text-paper">
                  {ev.title}
                </p>
                <p className="mt-2 text-sm text-ash">{ev.detail}</p>
              </li>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
