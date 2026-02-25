import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#ffffff",
          accent: "#e0f2fe", // light blue-100
        },
        dark: {
          bg: "#0f172a", // slate-900
          accent: "#1e293b", // slate-800
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],

};

export default config;
