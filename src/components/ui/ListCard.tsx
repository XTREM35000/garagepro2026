import { motion } from 'framer-motion'

export default function ListCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white shadow-sm rounded-2xl p-4 border hover:shadow-md transition"
    >
      {children}
    </motion.div>
  )
}
