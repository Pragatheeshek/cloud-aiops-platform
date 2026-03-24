/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      colors: {
        bg: "#070B1A",
        card: "#121A2E",
        primary: "#4F7CFF",
        accent: "#18E0C7",
        success: "#22C55E",
        warning: "#FFB347",
        danger: "#FF5D7A",
        text: "#EAF0FF",
      },
      boxShadow: {
        panel: "0 24px 50px rgba(3, 8, 24, 0.5)",
        glowSuccess: "0 0 0 1px rgba(34,197,94,0.4), 0 0 30px rgba(34,197,94,0.24)",
        glowDanger: "0 0 0 1px rgba(255,93,122,0.42), 0 0 30px rgba(255,93,122,0.26)",
      },
      animation: {
        floatin: "floatin 500ms ease-out",
        shimmer: "shimmer 1.4s ease-in-out infinite",
      },
      keyframes: {
        floatin: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
