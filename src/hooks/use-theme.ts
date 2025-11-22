
"use client";
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const s = (typeof window !== "undefined" && localStorage.getItem("theme")) ?? null;
      if (s === "dark" || s === "light") return s;
      // respect system
      return (typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "dark" : "light";
    } catch { return "light" }
  });

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    } catch { }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return { theme, toggleTheme, setTheme };
}
