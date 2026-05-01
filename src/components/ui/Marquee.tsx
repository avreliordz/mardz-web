"use client";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
  separator?: string;
};

export function Marquee({
  items,
  className,
  separator = "·",
}: MarqueeProps) {
  const text = items.join(` ${separator} `);
  const track = (
    <span className="inline-flex whitespace-nowrap px-4">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="inline-flex items-center">
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-ash">
            {item}
          </span>
          {i < items.length - 1 && (
            <span className="mx-6 text-graphite">{separator}</span>
          )}
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden border-t border-graphite/80 py-4",
        className,
      )}
      aria-label={`Clientes: ${text}`}
    >
      <div className="animate-marquee flex w-max will-change-transform">
        {track}
        {track}
      </div>
    </div>
  );
}
