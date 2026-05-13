/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#1fbf7f",
          dark: "#149264",
          light: "#d6f6e8",
        },
        night: "#0f172a",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(31,191,127,0.2), transparent 35%), radial-gradient(circle at 80% 0%, rgba(15,23,42,0.15), transparent 35%)",
      },
    },
  },
  plugins: [],
};
