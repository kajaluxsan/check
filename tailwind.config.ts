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
          mute: "var(--fg-muted)",
          dim: "var(--fg-dim)",
        },
        lime: {
          accent: "var(--accent)",
          dark: "var(--accent-dark)",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        serif: ['"DM Serif Display"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
