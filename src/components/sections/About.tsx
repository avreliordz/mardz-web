"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function About() {
  return (
    <section
      id="about"
      data-cursor-light
      className="bg-paper px-5 py-24 text-ink md:px-8"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono-label text-ash">§ 02</p>

        <div className="mt-12 grid gap-16 md:grid-cols-[1.2fr_1fr]">
          <ScrollReveal>
            <h2
              id="about-heading"
              className="section-title mb-8 max-w-2xl text-balance text-ink md:mb-10"
            >
              I develop and deliver your business end-to-end
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-ink/90 md:text-lg">
              My path started in digital arts and evolved toward scalable
              solutions. I&apos;ve worked with VC-backed startups and Fortune
              500 companies such as Puma, Adidas, and News Corp—always bridging
              design and engineering.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <dl className="space-y-8 border-l border-graphite/30 pl-8">
              <div>
                <dt className="font-display text-5xl text-ink">10+</dt>
                <dd className="mt-1 font-mono text-xs uppercase tracking-widest text-ash">
                  years of experience
                </dd>
              </div>
              <div>
                <dt className="font-display text-5xl text-ink">120+</dt>
                <dd className="mt-1 font-mono text-xs uppercase tracking-widest text-ash">
                  clients
                </dd>
              </div>
              <div>
                <dt className="font-display text-5xl text-ink">200+</dt>
                <dd className="mt-1 font-mono text-xs uppercase tracking-widest text-ash">
                  hypotheses validated
                </dd>
              </div>
            </dl>
          </ScrollReveal>
        </div>

        <div className="mt-16 inline-flex rounded-full border border-graphite bg-white/60 px-5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink/80">
          Lead Product Developer @Interact Studio
        </div>
      </div>
    </section>
  );
}
