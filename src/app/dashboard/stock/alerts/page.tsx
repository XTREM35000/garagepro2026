"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export default function StockAlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Alertes Stock</h1>
        <p className="text-gray-600 dark:text-gray-400">Pièces avec stock faible ou rupture</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <AlertCircle size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500">Tous les stocks sont corrects</p>
      </div>
    </div>
  );
}
