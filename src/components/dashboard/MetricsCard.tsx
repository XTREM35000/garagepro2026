"use client";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function MetricsCard({ title, value, icon }: { title: string; value: string | number; icon?: string }) {
  const IconComp: any = icon && (Icons as any)[icon];

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-6 rounded-3xl bg-white shadow-lg flex items-center gap-4 border"
    >
      <div className="p-3 bg-gray-100 rounded-2xl">
        {IconComp ? <IconComp size={26} /> : <div className="w-6 h-6 bg-gray-300 rounded" />}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}
