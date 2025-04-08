/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "secondary-bg": "var(--secondary-bg)",
        text: "var(--text)",
        "secondary-text": "var(--secondary-text)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        gray: "var(--gray)",
        "gray-hover": "var(--gray-hover)",
        red: "var(--red)",
        "red-hover": "var(--red-hover)",
      },
    },
  },
  plugins: [],
};
