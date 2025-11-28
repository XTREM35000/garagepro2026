"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { EmailInput } from "@/components/ui/EmailInput";
import { PhoneInput } from "@/components/ui/PhoneInput";

interface ClientSearchProps {
  onNext: (data: any) => void;
}

export default function ClientSearch({ onNext }: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [showNewClient, setShowNewClient] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const handleAddNewClient = () => {
    if (formData.nom && formData.prenom && formData.telephone) {
      onNext({
        ...formData,
        type: "new",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Informations Client</h3>

      {!showNewClient ? (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Chercher un client existant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {clients.length === 0 && !searchTerm && (
            <button
              onClick={() => setShowNewClient(true)}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Nouveau Client
            </button>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nom"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
              className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <EmailInput
            value={formData.email}
            onChange={(email) => setFormData({ ...formData, email })}
            placeholder="Email (optionnel)"
          />

          <PhoneInput
            value={formData.telephone}
            onChange={(phone) => setFormData({ ...formData, telephone: phone })}
          />

          <input
            type="text"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={(e) =>
              setFormData({ ...formData, adresse: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setShowNewClient(false)}
              className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              onClick={handleAddNewClient}
              disabled={!formData.nom || !formData.prenom || !formData.telephone}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
