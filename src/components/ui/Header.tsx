"use client"

import React from "react"
import { motion } from "framer-motion"
import { Bell, MessageCircle, Settings2 } from "lucide-react"
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage"
import UserMenu from "./UserMenu"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b shadow-sm max-w-full">
      <div className="relative">
        {/* absolute logo on extreme left */}
        <div className="absolute left-0 top-0 h-16 flex items-center pl-4">
          <AnimatedLogoGarage size={36} animated showText={false} />
        </div>

        <div className="h-16 px-6 pl-20 flex items-center justify-between w-full">
          {/* LEFT (placeholder to keep centered layout) */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block font-semibold text-gray-800">Multi-Garages</span>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-full hover:bg-gray-200">
              <Bell size={20} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-full hover:bg-gray-200 hidden sm:block">
              <MessageCircle size={20} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-full hover:bg-gray-200">
              <Settings2 size={20} />
            </motion.button>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
