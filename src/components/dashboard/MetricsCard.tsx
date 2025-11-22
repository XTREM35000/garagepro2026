"use client";
import React from "react";
import { motion } from "framer-motion";

export default function MetricsCard({ title, value, icon: Icon }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="kpi">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[rgba(37,211,102,0.12)]">
        {Icon ? <Icon size={18} className="text-[hsl(145 72% 34%)]" /> : null}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </motion.div>
  );
}
