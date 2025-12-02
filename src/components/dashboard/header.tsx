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
  HelpCircle,
} from "lucide-react";
// Animated logo intentionally removed from global header — kept only in sidebar for desktop
import UserMenu from "./user-menu";
import { ThemeToggle } from '@/components/ui/ThemeToggle';
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
        <div className="h-14 px-4 md:px-8 flex items-center justify-between max-w-full">
          {/* LEFT placeholder to keep layout centered */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block" aria-hidden="true"></div>
            {/* HELP BUTTON - déplacé à gauche */}
            <button
              aria-label="Aide"
              title="Aide & Documentation"
              onClick={() => {
                if (typeof window !== "undefined") window.location.href = "/help"
              }}
              className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow hover:scale-105 transition"
            >
              <HelpCircle size={18} />
            </button>
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
            <div className="flex items-center">
              <ThemeToggle />
            </div>

            {/* USER MENU */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
