"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MessageCircle,
  Settings2,
  Search,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";
import UserMenu from "./user-menu";
import { useTheme } from "@/hooks/use-theme";

export default function Header({ onOpenMobile, isMobileOpen }: { onOpenMobile?: () => void; isMobileOpen?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="
        sticky top-0 z-40
        bg-white/60 dark:bg-gray-900/60
        backdrop-blur-xl
        border-b border-black/10 dark:border-white/10
        shadow-lg
      "
    >
      <div className="relative">
        {/* absolute logo on extreme left */}
        <div className="absolute left-0 top-0 h-16 flex items-center pl-4">
          <AnimatedLogoGarage size={34} animated showText={false} />
        </div>

        <div className="h-16 px-4 md:px-8 pl-20 flex items-center justify-between max-w-full">
          {/* LEFT placeholder to keep layout centered */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block" aria-hidden="true"></div>
          </div>

          {/* RIGHT : MOBILE BURGER + ICONS + USER */}
          <div className="flex items-center gap-3">
            {/* Mobile burger (opens sidebar) */}
            <button
              className="md:hidden p-2 rounded-xl bg-gray-200 dark:bg-gray-700 shadow hover:scale-105 transition"
              onClick={() => {
                if (onOpenMobile) return onOpenMobile()
                document.dispatchEvent(new Event("open-mobile-sidebar"))
              }}
              aria-label="Ouvrir le menu"
              aria-expanded={isMobileOpen ? true : false}
            >
              <Menu size={20} />
            </button>

            {/* THEME TOGGLE */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 shadow hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* USER MENU */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
