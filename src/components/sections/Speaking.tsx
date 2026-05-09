"use client";

import { speakingEvents } from "@/data/speaking";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Speaking() {
  return (
    <section
      id="speaking"
      className="border-t border-graphite bg-canvas px-5 py-24 md:px-8"
      aria-labelledby="speaking-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <ScrollReveal>
          <p className="font-mono-label text-smoke">— 06</p>
          <h2 id="speaking-heading" className="section-title mt-4 text-ink">
            Speaker @
          </h2>
        </ScrollReveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {speakingEvents.map((ev, i) => (
            <ScrollReveal key={`${ev.year}-${ev.title}`} delay={i * 0.05}>
              <li className="group border border-graphite bg-carbon/50 p-6 transition-colors hover:border-ash/50">
                <p className="font-mono text-3xl text-ink">{ev.year}</p>
                <p className="mt-4 font-display text-xl text-ash group-hover:text-ink">
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
