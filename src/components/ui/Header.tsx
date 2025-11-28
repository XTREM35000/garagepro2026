"use client"

import React from "react"
import { motion } from "framer-motion"
import { Bell, MessageCircle, Settings2, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage"
import UserMenu from "./UserMenu"

export default function Header() {
  const router = useRouter()
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b shadow-sm max-w-full">
      <div className="relative">
        <div className="h-16 px-6 flex items-center justify-between w-full">
          {/* LEFT - Help button global */}
          <div className="flex items-center gap-3">
            <motion.button
              aria-label="Aide"
              title="Aide & Documentation"
              onClick={() => router.push('/help')}
              className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-1 ring-blue-700/20 cursor-pointer transform-gpu transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 active:translate-y-[1px]"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
            <span className="hidden sm:block font-semibold text-gray-800 dark:text-white">GaragePro</span>
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
