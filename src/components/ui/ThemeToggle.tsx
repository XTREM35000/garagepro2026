"use client"

"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mq.matches)
      const handler = (e: any) => setReducedMotion(e.matches)
      mq.addEventListener?.('change', handler)
      return () => mq.removeEventListener?.('change', handler)
    } catch {
      setReducedMotion(false)
    }
  }, [])

  const knobX = theme === 'dark' ? 36 : 2

  return (
    <button
      aria-label="Basculer le thème"
      title="Basculer le thème"
      onClick={toggleTheme}
      aria-pressed={theme === 'dark'}
      className={`relative inline-flex items-center h-10 w-20 rounded-full p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${className ?? ''}`}
    >
      {/* Background track */}
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border border-gray-700' : 'bg-gradient-to-r from-white via-surface-muted to-white border border-gray-200'}`}
        style={{ boxShadow: theme === 'dark' ? 'inset 0 1px 0 rgba(255,255,255,0.02)' : 'inset 0 1px 0 rgba(0,0,0,0.03)' }}
      />

      {/* Icons and knob */}
      <div className="relative z-10 flex items-center justify-between w-full px-2">
        <span className="text-yellow-400"><Sun size={14} /></span>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            aria-hidden
            key={theme}
            className="h-8 w-8 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-md"
            initial={reducedMotion ? {} : { x: theme === 'dark' ? 2 : 36 }}
            animate={{ x: knobX }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
            style={{ boxShadow: theme === 'dark' ? '0 6px 18px rgba(0,0,0,0.6)' : '0 8px 24px rgba(16,24,40,0.08)' }}
          >
            {theme === 'dark' ? <Moon size={14} className="text-white" /> : <Sun size={14} className="text-yellow-500" />}
          </motion.div>
        </AnimatePresence>

        <span className="text-sky-500 opacity-0">.</span>
      </div>
    </button>
  )
}
