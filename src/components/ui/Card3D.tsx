"use client";
import { motion } from "framer-motion";

export default function Card3D({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="rounded-3xl bg-white shadow-xl p-6 border border-gray-100"
    >
      {children}
    </motion.div>
  );
}
