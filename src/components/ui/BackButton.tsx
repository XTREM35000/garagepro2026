"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      onClick={() => router.back()}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition shadow-sm"
    >
      <ArrowLeft size={16} />
      Retour
    </motion.button>
  );
}
