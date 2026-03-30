// tailwind.config.ts
import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms"; // Gunakan import, bukan require

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
        secondary: "#635d5d",
        tertiary: "#006a46",
        surface: "#f9f9f9",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#564241",
        "outline-variant": "#ddc0be",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container-high": "#e8e8e8",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
        headline: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [forms], // Menggunakan variabel import
};

export default config;