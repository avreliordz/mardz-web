import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--color-black)",
        ink: "var(--color-ink)",
        carbon: "var(--color-carbon)",
        graphite: "var(--color-graphite)",
        ash: "var(--color-ash)",
        smoke: "var(--color-smoke)",
        fog: "var(--color-fog)",
        paper: "var(--color-paper)",
        white: "var(--color-white)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "300ms",
        base: "500ms",
        slow: "900ms",
        crawl: "1400ms",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
