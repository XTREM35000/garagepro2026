"use client";
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const s = typeof window !== "undefined" && localStorage.getItem("theme");
      if (s === "dark" || s === "light") return s as any;
      return typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    } catch { return "light"; }
  });

  useEffect(() => {
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      document.documentElement.style.transition = "background-color .25s ease, color .25s ease";
      localStorage.setItem("theme", theme);
    } catch { }
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");
  return { theme, toggleTheme, setTheme };
}
