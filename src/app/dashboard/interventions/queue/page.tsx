"use client";

import React from "react";
import { Clock } from "lucide-react";

export default function InterventionQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">File d&apos;Attente</h1>
        <p className="text-gray-600 dark:text-gray-400">Véhicules en attente de prise en charge</p>
      </div>

      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Clock size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500">Aucun véhicule en attente</p>
      </div>
    </div>
  );
}
