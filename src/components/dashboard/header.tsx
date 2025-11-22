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

export default function Header() {
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
      <div className="h-16 px-4 md:px-8 flex items-center justify-between">
        {/* LEFT : LOGO + SEARCH */}
        <div className="flex items-center gap-4">

          {/* MOBILE: BURGER */}
          <button
            className="md:hidden p-2 rounded-xl bg-gray-200 dark:bg-gray-700 shadow hover:scale-105 transition"
            onClick={() => document.dispatchEvent(new Event("open-mobile-sidebar"))}
          >
            <Menu size={20} />
          </button>

          {/* LOGO */}
          {/* <div className="hidden md:flex items-center gap-3">
            <AnimatedLogoGarage size={34} animated showText={false} />
          </div> */}

          {/* SEARCH PREMIUM */}
          <div
            className="
              hidden md:flex items-center gap-3
              px-4 py-2 rounded-2xl
              bg-gray-100 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              shadow-inner
            "
          >
            <Search size={18} className="text-gray-500 dark:text-gray-400" />
            <input
              placeholder="Rechercher : véhicules, clients..."
              className="bg-transparent outline-none text-sm w-60"
            />
          </div>
        </div>

        {/* RIGHT : ICONS */}
        <div className="flex items-center gap-3">

          {/* NOTIFICATIONS */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            className="
              p-2 rounded-xl
              bg-gray-100 dark:bg-gray-800
              shadow hover:bg-gray-200 dark:hover:bg-gray-700
            "
          >
            <Bell size={20} />
          </motion.button>

          {/* MESSAGES */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            className="
              p-2 rounded-xl hidden sm:block
              bg-gray-100 dark:bg-gray-800
              shadow hover:bg-gray-200 dark:hover:bg-gray-700
            "
          >
            <MessageCircle size={20} />
          </motion.button>

          {/* SETTINGS */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            className="
              p-2 rounded-xl
              bg-gray-100 dark:bg-gray-800
              shadow hover:bg-gray-200 dark:hover:bg-gray-700
            "
          >
            <Settings2 size={20} />
          </motion.button>

          {/* THEME TOGGLE */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            onClick={toggleTheme}
            className="
              p-2 rounded-xl
              bg-gray-200 dark:bg-gray-700
              shadow hover:bg-gray-300 dark:hover:bg-gray-600
            "
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* USER MENU */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
