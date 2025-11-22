'use client'
import { motion } from 'framer-motion'

export default function MobileFloatingButton({ icon: Icon, onClick }: any) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="md:hidden fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-full shadow-xl"
      onClick={onClick}
    >
      <Icon size={20} />
    </motion.button>
  )
}
