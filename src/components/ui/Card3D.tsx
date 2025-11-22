"use client";
import React from "react";
import { motion } from "framer-motion";
import cn from "clsx";

export default function Card3D({ children, className = "" }: any) {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 22px 70px rgba(8,10,20,0.12)" }}
      transition={{ type: "spring", stiffness: 260 }}
      className={cn("card-3d", className)}
    >
      {children}
    </motion.div>
  );
}
