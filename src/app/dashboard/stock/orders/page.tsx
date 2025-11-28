"use client";

import React from "react";
import { Package } from "lucide-react";

export default function StockOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Commandes Fournisseurs</h1>
        <p className="text-gray-600 dark:text-gray-400">Gérer les commandes de pièces</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Package size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500">Aucune commande en cours</p>
      </div>
    </div>
  );
}
