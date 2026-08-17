/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#EFE2D0", // Un fond beige/sable bien chaud et coloré (fini le blanc !)
          soft: "#E2CFB4",    // Encore plus prononcé pour les sections secondaires
          card: "#FBF7F0",    // Les cartes restent claires pour bien faire ressortir le texte
        },
        forest: {
          DEFAULT: "#382923", // Un brun espresso très riche
          light: "#523F36",
          deep: "#211714",    // Mode sombre très chaleureux et profond
        },
        clay: {
          DEFAULT: "#B85D3B", // Un terracotta/brique chaleureux et éclatant
          dark: "#96482B",
          light: "#D27B5A",
        },
        ink: {
          DEFAULT: "#2B1E19", 
          soft: "#5E463E",
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