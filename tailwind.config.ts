import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          bg: "var(--bg)",
          elev: "var(--bg-elev)",
          elev2: "var(--bg-elev-2)",
          border: "var(--border)",
          "border-strong": "var(--border-strong)",
          mute: "var(--fg-muted)",
          dim: "var(--fg-dim)",
        },
        // Legacy alias — `lime-accent` is used everywhere in the codebase
        // but visually points to the Swiss red accent now.
        lime: {
          accent: "var(--accent)",
          dark: "var(--accent-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dark: "var(--accent-dark)",
          soft: "var(--accent-soft)",
          border: "var(--accent-border)",
        },
        status: {
          good: "var(--good)",
          warn: "var(--warn)",
          mid: "var(--mid)",
          bad: "var(--bad)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
        input: "12px",
      },
      boxShadow: {
        card: "var(--shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
