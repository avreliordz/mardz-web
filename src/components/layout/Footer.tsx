"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

const nav = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="border-t border-graphite bg-black px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-ash">
          MARDZ™ © {new Date().getFullYear()} — Monterrey, MX
        </p>
        <nav
          className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest text-fog"
          aria-label="Pie de página"
        >
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-paper">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <p className="text-sm text-ash">
            Designed &amp; built by Marco A. Rodríguez
          </p>
          <button
            type="button"
            onClick={scrollTop}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-paper"
            aria-label="Volver arriba"
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
