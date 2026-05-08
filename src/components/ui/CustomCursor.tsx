"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

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
  const [mountEl, setMountEl] = useState<HTMLElement | null>(null);
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
    setMountEl(document.body);
  }, []);

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

  const discStyle: CSSProperties = lightBg
    ? {
        width: dim,
        height: dim,
        backgroundColor: "rgba(18,18,18,0.92)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.55), 0 0 0 2px rgba(10,10,10,0.4), 0 4px 20px rgba(0,0,0,0.35)",
        transitionProperty: "width, height, background-color, box-shadow",
        transitionDuration: "0.16s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }
    : {
        width: dim,
        height: dim,
        backgroundColor: "rgba(252,252,252,0.96)",
        boxShadow:
          "0 0 0 1px rgba(10,10,10,0.92), 0 0 0 2px rgba(255,255,255,0.5), 0 3px 18px rgba(0,0,0,0.45)",
        transitionProperty: "width, height, background-color, box-shadow",
        transitionDuration: "0.16s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      };

  const layer = (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 transition-opacity duration-100 ease-out",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{ zIndex: 2147483646 }}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none fixed left-0 top-0"
        style={{ x: sx, y: sy, zIndex: 2147483647 }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          style={discStyle}
        />
      </motion.div>
    </div>
  );

  if (!mountEl) return null;

  return createPortal(layer, mountEl);
}
