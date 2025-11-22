import { FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FactureCard({ number, montant, client, onClick }: any) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-4 mb-3 rounded-xl bg-white dark:bg-neutral-900 shadow-card cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
          <FileText size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold">Facture #{number}</p>
          <p className="text-xs text-gray-500">{client}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className="font-semibold">{montant} FCFA</p>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </motion.div>
  );
}
