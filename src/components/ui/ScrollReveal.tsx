"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { motionDuration, motionEasing } from "@/lib/utils";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: motionDuration.base,
        delay,
        ease: motionEasing,
      }}
    >
      {children}
    </motion.div>
  );
}
