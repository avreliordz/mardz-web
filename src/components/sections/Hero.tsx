"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import MetallicBlob from "@/components/blob/MetallicBlob";
import { TextReveal } from "@/components/ui/TextReveal";
import { Marquee } from "@/components/ui/Marquee";
import { motionDuration, motionEasing } from "@/lib/utils";

const clients = [
  "Puma",
  "Adidas",
  "News Corp",
  "Globe and Mail",
  "Wizeline",
  "Rappi",
  "Value",
  "Prevify",
  "Prevenco",
  "Dow Jones",
  "Tec de Monterrey",
  "Binance",
  "Bimbo",
  "Oxxo",
  "Merco",
];

export function Hero() {
  return (
    <section
      className="relative min-h-screen bg-canvas pt-28"
      aria-labelledby="hero-heading"
    >
      <MetallicBlob className="min-h-screen" />

      <div className="pointer-events-none relative z-10 mx-auto flex max-w-[1400px] flex-col px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 pb-6 text-xs uppercase tracking-[0.2em] text-ash md:flex-row md:items-center">
          <span className="font-mono">Based in Monterrey, MX</span>
          <span className="font-mono text-right md:text-left">
            Product Developer + Interaction Designer
          </span>
        </div>

        <div className="grid flex-1 gap-12 py-10 md:min-h-[70vh] md:grid-cols-[1fr_280px] md:items-end md:py-16">
          <div id="hero-heading">
            <TextReveal
              lines={["End-to-End", "Product", "Developer."]}
              italicIndices={[1]}
              delayStart={0.15}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.85,
              duration: motionDuration.base,
              ease: motionEasing,
            }}
            className="flex flex-col gap-6 border-t border-graphite/64 pt-8 md:border-t-0 md:pt-0"
          >
            <ul className="space-y-3 font-mono text-sm text-fog">
              <li>— 10+ years of experience</li>
              <li>— Startups → Fortune 500</li>
              <li>— Design × Code</li>
            </ul>
            <a
              href="#work"
              className="group pointer-events-auto inline-flex w-max items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-smoke"
              data-cursor-hover
            >
              Scroll to explore
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10">
        <Marquee items={clients} />
      </div>
    </section>
  );
}
