
"use client";

import React from "react";
import { motion } from "framer-motion";
import { BellIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import UserMenu from "./user-menu";
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage";
import { useTheme } from "@/hooks/use-theme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* <AnimatedLogoGarage size={32} animated showText={false} />
          <div className="hidden md:block text-sm font-semibold text-gray-700">Garage Manager</div> */}

          {/* Search compact */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
            <input placeholder="Rechercher véhicules, clients..." className="bg-transparent outline-none text-sm" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="h-5 w-5 text-gray-700" />
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} className="p-2 rounded-full hover:bg-gray-100 hidden sm:inline-flex">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-700" />
          </motion.button>

          <motion.button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100">
            {theme === "dark" ? "🌙" : "☀️"}
          </motion.button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
