"use client";
import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function HeroBanner({ title = "", subtitle = "", image = "/images/admin.jpg" }: { title?: string; subtitle?: string; image?: string }) {
  return (
    <div className="hero">
      <motion.img
        src={image}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover"
        alt={title}
      />
      <div className="overlay" />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-sub">{subtitle}</p>}
        <div className="mt-4 flex gap-3">
          <Button>Nouvelle entrée</Button>
          <Button variant="ghost">Exporter</Button>
        </div>
      </motion.div>
    </div>
  );
}
