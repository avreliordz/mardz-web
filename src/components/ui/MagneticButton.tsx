"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
};

const spring = { damping: 20, stiffness: 300, mass: 0.2 };

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  href,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, spring);
  const ySpring = useSpring(y, spring);
  const transform = useMotionTemplate`translate(${xSpring}px, ${ySpring}px)`;

  function handleMove(clientX: number, clientY: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((clientX - cx) * strength);
    y.set((clientY - cy) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const inner = (
    <div
      ref={ref}
      className={cn("inline-flex", className)}
      onPointerMove={(e) => handleMove(e.clientX, e.clientY)}
      onPointerLeave={reset}
      onPointerEnter={reset}
    >
      <motion.span style={{ transform }} className="inline-block">
        {children}
      </motion.span>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-flex" aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex border-0 bg-transparent p-0"
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}
