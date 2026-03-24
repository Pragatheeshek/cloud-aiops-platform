/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B1220",
        card: "#111827",
        primary: "#3B82F6",
        accent: "#22D3EE",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        text: "#E5E7EB",
      },
      boxShadow: {
        panel: "0 20px 45px rgba(2, 6, 23, 0.35)",
        glowSuccess: "0 0 0 1px rgba(16,185,129,0.35), 0 0 26px rgba(16,185,129,0.22)",
        glowDanger: "0 0 0 1px rgba(239,68,68,0.35), 0 0 26px rgba(239,68,68,0.22)",
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
