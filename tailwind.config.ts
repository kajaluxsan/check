import type { Config } from "tailwindcss";

const config: Config = {
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
        lime: {
          accent: "var(--accent)",
          dark: "var(--accent-hover)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
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
        mono: ['"JetBrains Mono"', "monospace"],
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
