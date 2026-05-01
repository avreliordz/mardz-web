"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { ProjectListItem } from "@/data/projects";
import { cn, motionDuration, motionEasing } from "@/lib/utils";

type ProjectRowProps = {
  project: ProjectListItem;
  index: number;
};

export function ProjectRow({ project, index }: ProjectRowProps) {
  const [hover, setHover] = useState(false);
  const tagStr = project.tags.join(" + ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: motionDuration.base, delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="h-px origin-left scale-x-0 bg-graphite transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
      <Link
        href={`/work/${project.slug}`}
        className={cn(
          "relative grid gap-6 border-b border-graphite py-8 transition-colors duration-300 md:grid-cols-[1fr_auto] md:items-end",
          hover && "bg-carbon/90",
        )}
        aria-label={`View project ${project.title}`}
        data-cursor-hover
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-10">
          <span className="font-mono text-sm text-smoke">{project.num}</span>
          <div>
            <h3 className="font-display text-2xl text-paper md:text-3xl">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-ash">{project.client}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 md:justify-end">
          <span className="font-mono text-xs uppercase tracking-widest text-ash">
            {project.yearRange}
          </span>
          <span className="rounded-full border border-graphite px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-smoke">
            {tagStr}
          </span>
          <ArrowUpRight
            className={cn(
              "h-6 w-6 shrink-0 text-paper transition-transform duration-300",
              hover && "-translate-y-1 translate-x-1",
            )}
            aria-hidden
          />
        </div>

        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: motionDuration.fast, ease: motionEasing }}
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(100%,420px)] items-center border-l border-graphite/50 bg-black/40 px-6 py-6 backdrop-blur-sm md:flex"
            >
              <p className="text-left text-sm leading-relaxed text-fog">
                Open the case: role, process, and outcomes for{" "}
                <span className="text-paper">{project.title}</span>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}
