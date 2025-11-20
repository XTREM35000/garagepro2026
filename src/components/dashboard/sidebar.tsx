"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import AnimatedLogoGarage from '@/components/ui/AnimatedLogoGarage'

import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  WalletIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { key: 'home', label: 'Accueil', href: '/dashboard', icon: HomeIcon },
  { key: 'clients', label: 'Clients', href: '/dashboard/clients', icon: UsersIcon },
  { key: 'atelier', label: 'Atelier', href: '/dashboard/atelier', icon: WrenchScrewdriverIcon },
  { key: 'factures', label: 'Facturation', href: '/dashboard/factures', icon: WalletIcon },
  { key: 'messages', label: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
  { key: 'settings', label: 'Paramètres', href: '/tenant/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      className="h-screen bg-[#ECE5DD] border-r border-gray-300 flex flex-col shadow-sm"
    >
      {/* HEADER LOGO */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
        <div className="flex items-center gap-3">
          <AnimatedLogoGarage size={42} animated showText={!collapsed} />
        </div>

        <button
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((s) => !s)}
          className="p-1 rounded hover:bg-gray-200"
        >
          <motion.span
            animate={{ rotate: collapsed ? 180 : 0 }}
            className="text-gray-700"
          >
            ❮
          </motion.span>
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)

          return (
            <Link key={item.key} href={item.href}>
              <motion.div
                whileHover={{ x: 6, scale: 1.02 }}
                className={`
                  flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all
                  ${isActive ? 'bg-[#25D366]/20 border-l-4 border-[#25D366]' : 'hover:bg-white'}
                `}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? 'text-[#25D366]' : 'text-gray-700'}`}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-gray-800 font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-3 border-t border-gray-300">
        <Link
          href="/auth"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white text-red-600"
        >
          <span className="h-8 w-8 bg-gray-300 rounded-full" />
          {!collapsed && <span>Se déconnecter</span>}
        </Link>
      </div>
    </motion.aside>
  )
}
