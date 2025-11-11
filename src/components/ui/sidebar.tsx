/**
 * Sidebar
 * Props: none (small example)
 * Renders a simple animated sidebar using Framer Motion
 */
"use client"
import React from 'react'
import { motion } from 'framer-motion'

export default function Sidebar() {
  return (
    <motion.nav initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="h-full bg-white border-r">
      <div className="p-4 font-bold">SaaS Starter</div>
      <ul className="p-4 space-y-2 text-sm">
        <li>Dashboard</li>
        <li>Billing</li>
        <li>Settings</li>
      </ul>
    </motion.nav>
  )
}
