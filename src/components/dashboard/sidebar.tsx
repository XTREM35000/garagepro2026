"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, HomeIcon, Cog6ToothIcon, UsersIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import AnimatedLogoGarage from '@/components/ui/AnimatedLogoGarage'

const navItems = [
  { key: 'home', label: 'Accueil', href: '/dashboard', icon: HomeIcon },
  { key: 'users', label: 'Utilisateurs', href: '/dashboard/users', icon: UsersIcon },
  { key: 'settings', label: 'Paramètres', href: '/tenant/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      className="h-screen bg-white border-r flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="mx-auto py-3">
            <div className="flex flex-col items-center">
              <AnimatedLogoGarage size={42} animated showText />
            </div>
          </div>
        </div>
        <button
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((s) => !s)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <ChevronLeftIcon className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href) ?? false
          return (
            <Link key={item.key} href={item.href}>
              <motion.div
                whileHover={{ x: 6 }}
                className={`flex items-center gap-3 p-2 rounded ${isActive ? 'bg-sky-50 border-l-2 border-sky-600' : 'hover:bg-slate-50'}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-sky-700' : 'text-sky-600'}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t">
        <Link href="/auth" className="flex items-center gap-3 p-2 rounded hover:bg-slate-50">
          <span className="h-8 w-8 bg-gray-200 rounded-full" />
          {!collapsed && <div className="text-sm">Se déconnecter</div>}
        </Link>
      </div>
    </motion.aside>
  )
}
