/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        "secondary-bg": "#f1f5f9",
        text: "#1e293b",
        "secondary-text": "#64748b",
        accent: "#2563eb",
        "accent-hover": "#1d4ed8",
        gray: "#64748b",
        "gray-hover": "#475569",
        red: "#ef4444",
        "red-hover": "#dc2626",
      },
    },
  },
  plugins: [],
};
