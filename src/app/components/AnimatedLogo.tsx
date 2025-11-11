"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedLogo() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex items-center justify-center"
    >
      <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs />
        <rect width="24" height="24" rx="6" fill="url(#g)" />
        <g fill="white">
          <path d="M6 12h12v1H6z" />
          <path d="M6 7h12v1H6z" />
          <path d="M6 17h12v1H6z" />
        </g>
      </svg>
    </motion.div>
  );
}
