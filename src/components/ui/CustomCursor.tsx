"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState } from "react";

const spring = { damping: 28, stiffness: 400, mass: 0.15 };

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [lightBg, setLightBg] = useState(false);
  const [overBlobHero, setOverBlobHero] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqFine.matches || mqReduce.matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement | null;
      setOverBlobHero(!!t?.closest("[data-blob-hero]"));
    };

    const leave = () => setVisible(false);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, [data-cursor-hover]",
      );
      setHovering(!!interactive);
      const onPaper = t.closest("[data-cursor-light]");
      setLightBg(!!onPaper);
      setOverBlobHero(!!t.closest("[data-blob-hero]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    document.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  useEffect(() => {
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqFine.matches || mqReduce.matches) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && !overBlobHero && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden
        >
          <motion.div
            className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40"
            style={{ x: sx, y: sy }}
            animate={{
              width: hovering ? 48 : 12,
              height: hovering ? 48 : 12,
              backgroundColor: lightBg
                ? "rgba(10,10,10,0.85)"
                : "rgba(255,255,255,0.9)",
              borderColor: lightBg ? "rgba(10,10,10,0.4)" : "rgba(255,255,255,0.5)",
            }}
            transition={{ type: "spring", ...spring }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
