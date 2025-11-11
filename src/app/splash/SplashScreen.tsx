"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedLogo from "../components/AnimatedLogo";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete(), 1400);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-700 via-emerald-600 to-teal-400">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "circOut" }}
        className="flex flex-col items-center gap-6 p-6"
      >
        <AnimatedLogo />
        <motion.h1
          className="text-white text-2xl font-semibold tracking-tight"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          SaaS Manager
        </motion.h1>
        <motion.p className="text-white/80 text-sm mt-1">Chargement…</motion.p>
      </motion.div>
    </div>
  );
}
