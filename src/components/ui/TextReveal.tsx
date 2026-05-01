"use client";

import { motion } from "framer-motion";
import { cn, motionDuration, motionEasing, motionStagger } from "@/lib/utils";

type TextRevealProps = {
  lines: string[];
  className?: string;
  lineClassName?: string;
  italicIndices?: number[];
  delayStart?: number;
};

export function TextReveal({
  lines,
  className,
  lineClassName,
  italicIndices = [],
  delayStart = 0,
}: TextRevealProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {lines.map((line, i) => (
        <div key={line} className="overflow-hidden">
          <motion.span
            className={cn(
              "hero-title block text-paper",
              italicIndices.includes(i) && "hero-title--italic",
              lineClassName,
            )}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{
              duration: motionDuration.slow,
              delay: delayStart + i * motionStagger,
              ease: motionEasing,
            }}
          >
            {line}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
