"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { motionDuration, motionEasing } from "@/lib/utils";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(10,10,10,0)", "rgba(10,10,10,0.88)"],
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 80],
    ["blur(0px)", "blur(12px)"],
  );

  return (
    <>
      <motion.header
        style={{
          backgroundColor: headerBg,
          backdropFilter: backdropFilter,
          WebkitBackdropFilter: backdropFilter,
        }}
        className="fixed inset-x-0 top-0 z-[110] border-b border-white/43"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/"
            className="font-mono text-xs tracking-[0.25em] text-paper"
            aria-label="MARDZ, home"
          >
            MARDZ™
          </Link>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Main">
            {links.map((l) => (
              <motion.a
                key={l.href}
                href={l.href}
                className="group relative font-body text-sm text-fog transition-colors hover:text-paper"
                whileHover={{ y: -1 }}
                transition={{ duration: motionDuration.fast, ease: motionEasing }}
              >
                <span className="relative">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-paper transition-all duration-300 ease-out-expo group-hover:w-full" />
                </span>
              </motion.a>
            ))}
            <MagneticButton href="#contact" aria-label="Go to contact">
              <span className="rounded-full border border-paper px-4 py-2 font-mono text-xs uppercase tracking-widest text-paper transition-colors duration-300 hover:bg-paper hover:text-black">
                Let&apos;s talk →
              </span>
            </MagneticButton>
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-graphite p-2 text-paper md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: motionDuration.base, ease: motionEasing }}
            className="fixed inset-0 z-[100] flex flex-col bg-black pt-24 md:hidden"
          >
            <nav className="flex flex-1 flex-col gap-6 px-8 py-8" aria-label="Mobile">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: motionDuration.fast }}
                  className="font-display text-4xl text-paper"
                >
                  {l.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex w-max rounded-full border border-paper px-6 py-3 font-mono text-sm uppercase tracking-widest text-paper"
              >
                Let&apos;s talk →
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
