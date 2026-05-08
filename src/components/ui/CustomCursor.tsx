"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const spring = { damping: 28, stiffness: 400, mass: 0.15 };

function hitTest(clientX: number, clientY: number) {
  const el = document.elementFromPoint(clientX, clientY);
  if (!el) {
    return { overBlobHero: false, hovering: false, lightBg: false };
  }
  return {
    overBlobHero: !!el.closest("[data-blob-hero]"),
    hovering: !!el.closest(
      "a, button, [role='button'], input, textarea, [data-cursor-hover]",
    ),
    lightBg: !!el.closest("[data-cursor-light]"),
  };
}

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [lightBg, setLightBg] = useState(false);
  const [overBlobHero, setOverBlobHero] = useState(false);
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqFine.matches || mqReduce.matches) return;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const hit = hitTest(e.clientX, e.clientY);
      setOverBlobHero(hit.overBlobHero);
      setHovering(hit.hovering);
      setLightBg(hit.lightBg);
    };

    const hide = () => setVisible(false);

    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0) setPressed(true);
    };
    const up = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0) setPressed(false);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", hide);
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

  const base = hovering ? 48 : overBlobHero ? 14 : 12;
  const dim = Math.min(base + (pressed ? 4 : 0), 52);
  const bg = lightBg ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.9)";
  const borderCol = lightBg ? "rgba(10,10,10,0.4)" : "rgba(255,255,255,0.5)";

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      aria-hidden
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: sx,
          y: sy,
          width: dim,
          height: dim,
          backgroundColor: bg,
          border: `1px solid ${borderCol}`,
          transitionProperty: "width, height, background-color, border-color",
          transitionDuration: "0.16s",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </motion.div>
  );
}
