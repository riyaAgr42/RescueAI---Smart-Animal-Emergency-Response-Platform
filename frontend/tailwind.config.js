/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Sora'", "'Space Grotesk'", "sans-serif"],
        body: ["'Manrope'", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#DBEAFE",
        },
        accent: {
          DEFAULT: "#F97316",
          dark: "#EA580C",
          light: "#FFEDD5",
        },
        surface: "#F8FAFC",
        night: "#0F172A",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 15% 20%, rgba(37,99,235,0.22), transparent 30%), radial-gradient(circle at 80% 10%, rgba(249,115,22,0.24), transparent 24%), linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,41,59,0.96) 45%, rgba(37,99,235,0.9) 100%)",
        "mesh-light":
          "radial-gradient(circle at top left, rgba(37,99,235,0.12), transparent 32%), radial-gradient(circle at top right, rgba(249,115,22,0.12), transparent 25%), linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(15,23,42,0.22)",
        emergency: "0 0 0 1px rgba(249,115,22,0.2), 0 16px 50px rgba(249,115,22,0.32)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.6s ease-in-out infinite",
        slideUp: "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(249,115,22,0.35)" },
          "50%": { boxShadow: "0 0 0 14px rgba(249,115,22,0.05)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0px)" },
        },
      },
    },
  },
  plugins: [],
};
