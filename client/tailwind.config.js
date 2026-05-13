/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "Times New Roman", "serif"],
        sans: ['"DM Sans"', "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        nh: {
          bg: "var(--nh-bg)",
          "bg-soft": "var(--nh-bg-soft)",
          surface: "var(--nh-surface)",
          "surface-2": "var(--nh-surface-2)",
          border: "var(--nh-border)",
          "border-strong": "var(--nh-border-strong)",
          text: "var(--nh-text)",
          muted: "var(--nh-text-muted)",
          accent: "var(--nh-accent)",
          "accent-soft": "var(--nh-accent-soft)",
          primary: "var(--nh-primary)",
          "primary-deep": "var(--nh-primary-deep)",
          success: "var(--nh-success)",
          danger: "var(--nh-danger)",
        },
      },
      boxShadow: {
        nh: "var(--nh-card-shadow)",
        "nh-soft": "var(--nh-shadow-soft)",
        "nh-inset": "var(--nh-shadow-inset)",
      },
      borderRadius: {
        nh: "var(--nh-radius)",
        "nh-sm": "var(--nh-radius-sm)",
        "nh-lg": "var(--nh-radius-lg)",
      },
      transitionDuration: {
        250: "250ms",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
