"use client";

import React from "react";
import { Archive } from "lucide-react";

export default function InterventionHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Historique Interventions</h1>
        <p className="text-gray-600 dark:text-gray-400">Interventions terminées et facturées</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Archive size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500">Aucun historique disponible</p>
      </div>
    </div>
  );
}
