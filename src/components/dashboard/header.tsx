"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BellIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import UserMenu from "./user-menu"
import AnimatedLogoGarage from "@/components/ui/AnimatedLogoGarage"
import { useAuth } from "@/lib/auth-context"

export default function Header() {
  const { user } = useAuth()
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Fetch current user profile from the database
    const fetchUserProfile = async () => {
      if (!user?.id) return
      try {
        const res = await fetch(`/api/auth/user/${user.id}`)
        if (res.ok) {
          const data = await res.json()
          setCurrentUser(data)
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err)
      }
    }
    fetchUserProfile()
  }, [user?.id])
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 h-16 shadow-sm">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* Menu Mobile */}
        <button className="p-2 rounded hover:bg-gray-100 md:hidden transition">
          ☰
        </button>

        {/* Small Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <AnimatedLogoGarage size={32} animated showText={false} />
          <span className="text-[#128C7E] font-bold hidden sm:block">
            Garage Manager
          </span>
        </motion.div>
      </div>

      {/* RIGHT SECTION (ACTIONS) */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <BellIcon className="h-6 w-6 text-gray-700" />
          <span className="absolute top-1 right-1 bg-[#25D366] text-white text-[10px] px-1.5 rounded-full">
            3
          </span>
        </motion.button>

        {/* Messages */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="relative p-2 rounded-full hover:bg-gray-100 hidden sm:block"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-700" />
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Cog6ToothIcon className="h-6 w-6 text-gray-700" />
        </motion.button>

        {/* USER MENU */}
        <UserMenu
          name={currentUser?.name || "Utilisateur"}
          avatarUrl={currentUser?.avatarUrl || null}
          role={currentUser?.role || null}
        />
      </div>
    </header>
  )
}
