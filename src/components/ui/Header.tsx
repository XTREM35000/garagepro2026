"use client"

import React from "react"
import { motion } from "framer-motion"
import { Bell, MessageCircle, Settings2, HelpCircle } from "lucide-react"
import Link from "next/link"
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage"
import UserMenu from "./UserMenu"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b shadow-sm max-w-full">
      <div className="relative">
        <div className="h-16 px-6 flex items-center justify-between w-full">
          {/* LEFT - Help button global */}
          <div className="flex items-center gap-3">
            <Link
              href="/help"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              title="Aide générale"
            >
              <HelpCircle size={20} className="text-gray-700 dark:text-gray-300" />
            </Link>
            <span className="hidden sm:block font-semibold text-gray-800 dark:text-white">Multi-Garages</span>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 hidden sm:block">
              <MessageCircle size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
              <Settings2 size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
