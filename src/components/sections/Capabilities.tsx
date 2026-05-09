"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { capabilities } from "@/data/capabilities";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn, motionDuration, motionEasing } from "@/lib/utils";

export function Capabilities() {
  const [openId, setOpenId] = useState<string | null>(capabilities[0]?.id ?? null);

  return (
    <section
      id="capabilities"
      className="border-t border-graphite bg-paper px-5 py-24 md:px-8"
      aria-labelledby="capabilities-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <ScrollReveal>
          <p className="font-mono-label text-smoke">— 05</p>
          <h2 id="capabilities-heading" className="section-title mt-4 text-ink">
            Capabilities
          </h2>
        </ScrollReveal>

        <div className="mt-12 divide-y divide-graphite">
          {capabilities.map((c) => {
            const isOpen = openId === c.id;
            return (
              <div key={c.id} className="py-2">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : c.id)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`cap-panel-${c.id}`}
                  id={`cap-trigger-${c.id}`}
                  data-cursor-hover
                >
                  <span className="flex gap-6">
                    <span className="font-mono text-sm text-ash">{c.id}</span>
                    <span className="font-display text-xl text-ink md:text-2xl">
                      {c.title}
                    </span>
                  </span>
                  <span className="shrink-0 text-ink" aria-hidden>
                    {isOpen ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`cap-panel-${c.id}`}
                      role="region"
                      aria-labelledby={`cap-trigger-${c.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: motionDuration.fast,
                        ease: motionEasing,
                      }}
                      className="overflow-hidden"
                    >
                      <p
                        className={cn(
                          "max-w-2xl pb-8 pl-0 text-sm leading-relaxed text-fog md:pl-14",
                        )}
                      >
                        {c.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
