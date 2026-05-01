import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const motionEasing = [0.16, 1, 0.3, 1] as const;

export const motionDuration = {
  fast: 0.3,
  base: 0.5,
  slow: 0.9,
  crawl: 1.4,
} as const;

export const motionStagger = 0.08;
