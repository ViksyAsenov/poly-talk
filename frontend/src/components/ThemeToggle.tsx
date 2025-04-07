import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const isBrowser = typeof window !== "undefined";

  const [isDark, setIsDark] = useState(() => {
    if (isBrowser) {
      const stored = localStorage.getItem("darkMode");

      if (stored !== null) return stored === "true";

      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isBrowser) {
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("darkMode", isDark.toString());
    }
  }, [isDark, isBrowser]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-2 py-1 rounded transition-colors duration-200 items-center text-center text-accent"
    >
      {/* {isDark ? "normal" : "𝓯𝓻𝓮𝓪𝓴𝔂"} */}
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
