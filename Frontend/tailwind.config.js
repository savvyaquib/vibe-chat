import daisyui from "daisyui";
import { THEMES } from "./src/constants/index.js";

const daisyThemes = THEMES.map((theme) => {
  if (theme === "light") return "light --default";
  if (theme === "dark") return "dark --prefersdark";
  return theme;
});

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui({ themes: daisyThemes })],
};
