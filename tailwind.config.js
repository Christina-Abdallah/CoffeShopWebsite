/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#EFE2D0",
          soft: "#E2CFB4",
          card: "#FBF7F0",
          50: "#FAF8F5",
          100: "#F5F0E8",
          200: "#EBE4D8",
          300: "#DDD4C4",
        },
        forest: {
          DEFAULT: "#382923",
          light: "#523F36",
          deep: "#211714",
          50: "#E8E4E1",
          100: "#D1C9C3",
          500: "#5E463E",
          700: "#382923",
          800: "#2A1F1A",
          900: "#1A1210",
        },
        clay: {
          DEFAULT: "#B85D3B",
          dark: "#96482B",
          light: "#D27B5A",
          50: "#FDF2EE",
          100: "#F9E3DA",
        },
        ink: {
          DEFAULT: "#2B1E19",
          soft: "#5E463E",
          light: "#7C6C67",
        },
        sage: {
          DEFAULT: "#137333",
          light: "#E6F4EA",
          dark: "#0D5224",
        },
        rose: {
          DEFAULT: "#B53E3E",
          light: "#FDF1F1",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(56, 41, 35, 0.3)",
      },
    },
  },
  plugins: [],
};