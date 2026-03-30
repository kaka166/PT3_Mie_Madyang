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
        primary: "#a0383b",
        "primary-container": "#c05051",
        "on-primary": "#ffffff",
        background: "#f9f9f9",
        surface: "#f9f9f9",
        "surface-container-low": "#f3f3f3",
        "on-surface": "#1a1c1c",
        tertiary: "#006a46",
      },
      fontFamily: {
        sans: ["var(--font-pjs)"],
      },
    },
  },
  plugins: [],
};
export default config;