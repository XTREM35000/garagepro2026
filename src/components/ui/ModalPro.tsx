'use client'
import { motion } from 'framer-motion'

export default function ModalPro({ open, onClose, children }: any) {
  if (!open) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed z-50 bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {children}
      </motion.div>
    </>
  )
}
