"use client";

import { motion } from "framer-motion";

export default function HeroBanner({ title = "", subtitle = "", image = "/image/stock.avif" }: { title?: string; subtitle?: string; image?: string }) {
  return (
    <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-xl mb-6">
      <motion.img
        src={image}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-10 left-10 text-white"
      >
        <h1 className="text-4xl font-bold drop-shadow-xl">{title}</h1>
        {subtitle && <p className="text-lg mt-2 text-white/90">{subtitle}</p>}
      </motion.div>
    </div>
  );
}
