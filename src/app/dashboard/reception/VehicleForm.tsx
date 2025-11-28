"use client";

import React, { useState } from "react";

interface VehicleFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function VehicleForm({ onNext, onBack }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    marque: "",
    modele: "",
    immatricule: "",
    kilometrage: "",
    couleur: "",
    etatGeneral: "",
  });

  const handleSubmit = () => {
    if (formData.marque && formData.modele && formData.immatricule) {
      onNext(formData);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Informations Véhicule</h3>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Marque"
          value={formData.marque}
          onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Modèle"
          value={formData.modele}
          onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <input
        type="text"
        placeholder="Immatriculation"
        value={formData.immatricule}
        onChange={(e) =>
          setFormData({ ...formData, immatricule: e.target.value })
        }
        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 uppercase"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          placeholder="Kilométrage"
          value={formData.kilometrage}
          onChange={(e) =>
            setFormData({ ...formData, kilometrage: e.target.value })
          }
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          placeholder="Couleur"
          value={formData.couleur}
          onChange={(e) =>
            setFormData({ ...formData, couleur: e.target.value })
          }
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <textarea
        placeholder="État général du véhicule"
        value={formData.etatGeneral}
        onChange={(e) =>
          setFormData({ ...formData, etatGeneral: e.target.value })
        }
        rows={3}
        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
      />

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={!formData.marque || !formData.modele || !formData.immatricule}
          className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
