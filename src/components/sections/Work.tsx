"use client";

import { ProjectRow } from "@/components/ui/ProjectRow";
import { projectList } from "@/data/projects";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Work() {
  return (
    <section
      id="work"
      className="bg-canvas px-5 py-24 md:px-8"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <ScrollReveal>
          <p className="font-mono-label text-smoke">— 04</p>
          <h2
            id="work-heading"
            className="section-title mt-4 text-ink"
          >
            Featured work
          </h2>
          <p className="mt-4 max-w-xl text-fog">
            Featured projects — strategy, design, and build.
          </p>
        </ScrollReveal>

        <div className="mt-16">
          {projectList.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
