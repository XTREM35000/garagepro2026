import { motion } from 'framer-motion'

export default function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </motion.div>
  )
}
