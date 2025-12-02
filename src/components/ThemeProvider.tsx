"use client";

import { useTheme } from "@/hooks/use-theme";
import { ReactNode, useEffect } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useTheme();

  // Applique les classes au body pour une meilleure compatibilité
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return <>{children}</>;
}