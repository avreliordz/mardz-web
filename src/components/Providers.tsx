"use client";

import { Analytics } from "@vercel/analytics/react";
import { CustomCursor } from "@/components/ui/CustomCursor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
      <CustomCursor />
    </>
  );
}
