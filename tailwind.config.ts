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
          bg: "#0a0a0a",
          elev: "#141414",
          elev2: "#1c1c1c",
          border: "#262626",
          mute: "#a3a3a3",
          dim: "#737373",
        },
        lime: {
          accent: "#c8f035",
          dark: "#a7cc2c",
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
