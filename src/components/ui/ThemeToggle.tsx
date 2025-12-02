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

  const trackStyle: React.CSSProperties = theme === 'dark'
    ? {
      background: 'linear-gradient(90deg, hsl(var(--theme-whatsapp) / 1), hsl(var(--theme-whatsapp) / 0.8))',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)'
    }
    : {
      background: 'linear-gradient(90deg, hsl(var(--theme-apple) / 1), hsl(var(--theme-apple) / 0.85))',
      boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)'
    }

  const knobStyle: React.CSSProperties = theme === 'dark'
    ? {
      background: 'white',
      boxShadow: '0 10px 30px hsl(var(--theme-whatsapp) / 0.22)'
    }
    : {
      background: 'white',
      boxShadow: '0 10px 30px hsl(var(--theme-apple) / 0.16)'
    }

  const iconColor = theme === 'dark' ? 'hsl(var(--theme-whatsapp) / 1)' : 'hsl(var(--theme-apple) / 1)'

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
        className={`absolute inset-0 rounded-full transition-colors duration-300 border`}
        style={{ ...trackStyle }}
      />

      {/* Icons and knob */}
      <div className="relative z-10 flex items-center justify-between w-full px-2">
        <span style={{ color: iconColor }}>
          <Sun size={14} />
        </span>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            aria-hidden
            key={theme}
            className="h-8 w-8 rounded-full flex items-center justify-center"
            initial={reducedMotion ? {} : { x: theme === 'dark' ? 2 : 36 }}
            animate={{ x: knobX }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
            style={{ ...knobStyle }}
          >
            {theme === 'dark' ? <Moon size={14} style={{ color: 'white' }} /> : <Sun size={14} style={{ color: 'hsl(var(--theme-apple) / 1)' }} />}
          </motion.div>
        </AnimatePresence>

        <span className="opacity-0">.</span>
      </div>
    </button>
  )
}
