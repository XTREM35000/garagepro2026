'use client'
import { Menu, User } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedLogoGarage from '@/components/ui/AnimatedLogoGarage'

export default function NavbarMobile({ onMenu }: { onMenu: () => void }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden fixed top-0 left-0 w-full h-14 bg-white/80 backdrop-blur-xl border-b z-50 flex items-center justify-between px-4"
    >
      <div className="flex items-center gap-3">
        <AnimatedLogoGarage size={34} animated />
        <span className="font-semibold text-gray-800">Garage</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg bg-gray-100"><User size={18} /></button>
        <button onClick={onMenu} className="p-2 rounded-lg bg-gray-100">
          <Menu size={18} />
        </button>
      </div>
    </motion.header>
  )
}
