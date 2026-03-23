/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F172A",
        card: "#1E293B",
        primary: "#1E3A8A",
        accent: "#06B6D4",
        success: "#10B981",
        warning: "#F59E0B",
        critical: "#EF4444",
        text: "#E2E8F0",
      },
      boxShadow: {
        panel: "0 20px 45px rgba(2, 6, 23, 0.35)",
      },
      animation: {
        floatin: "floatin 500ms ease-out",
      },
      keyframes: {
        floatin: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
