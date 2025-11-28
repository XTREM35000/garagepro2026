"use client";

import React, { useState } from "react";
import { Clock, AlertCircle, Plus } from "lucide-react";
import TablePro from "@/components/ui/TablePro";
import Card3D from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";

export default function FileAttentePage() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      immatricule: "AA-123-BB",
      marque: "Peugeot",
      modele: "308",
      client: "Jean Dupont",
      dateReception: "2025-11-28",
      urgence: "haute",
      probleme: "Moteur qui cale",
    },
    {
      id: 2,
      immatricule: "CC-456-DD",
      marque: "Renault",
      modele: "Clio",
      client: "Marie Martin",
      dateReception: "2025-11-27",
      urgence: "normale",
      probleme: "Freins usés",
    },
  ]);

  const columns = [
    {
      header: "Immatriculation",
      accessor: "immatricule",
      cell: (row: any) => <span className="font-mono font-bold">{row.immatricule}</span>,
    },
    {
      header: "Véhicule",
      accessor: "marque",
      cell: (row: any) => `${row.marque} ${row.modele}`,
    },
    {
      header: "Client",
      accessor: "client",
    },
    {
      header: "Urgence",
      accessor: "urgence",
      cell: (row: any) => (
        <Badge
          className={
            row.urgence === "haute"
              ? "bg-red-500"
              : row.urgence === "normale"
                ? "bg-yellow-500"
                : "bg-green-500"
          }
        >
          {row.urgence}
        </Badge>
      ),
    },
    {
      header: "Problème",
      accessor: "probleme",
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row: any) => (
        <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          Affecter
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">File d&apos;Attente</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Véhicules en attente de prise en charge ({vehicles.length})
        </p>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card3D>
          <div className="flex items-center gap-3">
            <Clock size={32} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <AlertCircle size={32} className="text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Urgentes</p>
              <p className="text-2xl font-bold">
                {vehicles.filter((v) => v.urgence === "haute").length}
              </p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <Plus size={32} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Temps moyen attente</p>
              <p className="text-2xl font-bold">1.2j</p>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="text-center py-8">
          <Clock size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Données en attente de chargement depuis la BD</p>
        </div>
      </div>
    </div>
  );
}
