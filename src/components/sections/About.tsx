"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function About() {
  return (
    <section
      id="about"
      className="bg-paper px-5 py-24 text-ink md:px-8"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono-label text-ash">— 02</p>

        <h2
          id="about-heading"
          className="section-title mt-12 mb-8 max-w-2xl text-balance text-ink md:mb-10"
        >
          About me
        </h2>

        <div className="grid gap-16 md:grid-cols-[1.2fr_1fr]">
          <ScrollReveal>
            <div className="max-w-2xl space-y-4 text-base leading-relaxed text-ink/90 md:text-lg">
              <p>
                My path started as a Digital Arts Bachelor with a strong
                interest towards human-computer interaction. Therefore I
                specialized in User Research and Product Design allowing me to
                work for a couple of well-known companies as a consultant for
                VC-backed startups and Fortune 500 companies such as Puma,
                Adidas, and News Corp—always bridging the gap between design and
                engineering.
              </p>
              <p>
                Today, I develop end-to-end innovative, accessible, and scalable
                businesses through digital products as an independent
                professional for innovation firms and startup entrepreneurs
                across many different industries.
              </p>
            </div>
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

        <div className="mt-16 inline-flex rounded-full border border-graphite bg-canvas/90 px-5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink/80">
          Lead Product Developer @Interact Studio
        </div>
      </div>
    </section>
  );
}
