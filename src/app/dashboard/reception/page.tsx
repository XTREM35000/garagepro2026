"use client";

import React, { useState } from "react";
import { Inbox, Plus } from "lucide-react";
import ReceptionForm from "./ReceptionForm";

export default function ReceptionPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleReceptionSubmit = (data: any) => {
    console.log("Nouvelle réception :", data);
    // TODO: Ajouter à la BD via API
    setVehicles([...vehicles, data]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Réception Véhicules</h1>
        <p className="text-gray-600 dark:text-gray-400">Enregistrer l&apos;arrivée et l&apos;état initial des véhicules</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Nouvelle Réception
        </button>
      </div>

      <ReceptionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleReceptionSubmit}
      />

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Inbox size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">Aucun véhicule en réception</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            {vehicles.map((v: any, idx: number) => (
              <div key={idx} className="p-4 border-b last:border-b-0">
                <p className="font-semibold">{v.vehicle?.marque} {v.vehicle?.modele}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{v.vehicle?.immatricule}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
