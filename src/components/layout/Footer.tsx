"use client";

import Link from "next/link";

const nav = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-graphite bg-canvas px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs text-ash">
          MARDZ™ © {new Date().getFullYear()} — Monterrey, MX
        </p>
        <nav
          className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest text-fog"
          aria-label="Footer"
        >
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-ash md:text-end">
          by Marco Aurelio
        </p>
      </div>
    </footer>
  );
}
