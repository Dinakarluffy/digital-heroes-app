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
        background: "var(--background)",
        foreground: "var(--foreground)",
        hero: {
          dark: "#0b0f17",
          card: "#131a26",
          cardHover: "#1a2332",
          border: "#232e42",
          gold: "#f59e0b",
          goldLight: "#fbbf24",
          emerald: "#10b981",
          emeraldLight: "#34d399",
          slate: "#94a3b8",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
