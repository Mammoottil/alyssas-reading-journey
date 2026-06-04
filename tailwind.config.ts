import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        cream: {
          50: "#fefdf8",
          100: "#fdf9ed",
          200: "#faf1d4",
          300: "#f5e4aa",
          400: "#eed076",
          500: "#e6bc4a",
          600: "#d4a232",
        },
        ink: {
          900: "#1a1208",
          800: "#2d1f0e",
          700: "#3d2c14",
          600: "#5c4422",
          500: "#7a5c30",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e3ebe3",
          200: "#c6d7c6",
          300: "#9ab89a",
          400: "#6d966d",
          500: "#4a7a4a",
          600: "#3a603a",
        },
        blush: {
          100: "#fdeef0",
          200: "#f9d5da",
          300: "#f2aab4",
          400: "#e87787",
          500: "#d94f63",
        },
      },
    },
  },
  plugins: [],
};

export default config;
