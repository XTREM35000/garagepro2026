"use client";

import React, { useState } from "react";
import { Wrench, TrendingUp } from "lucide-react";
import TablePro from "@/components/ui/TablePro";
import Card3D from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";

export default function EnCoursPage() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      immatricule: "BB-789-CC",
      marque: "Citroën",
      modele: "C3",
      client: "Pierre Durand",
      technicien: "Thomas Martin",
      debut: "2025-11-28 09:00",
      statut: "en-cours",
      pourcentage: 65,
    },
    {
      id: 2,
      immatricule: "DD-012-EE",
      marque: "Ford",
      modele: "Focus",
      client: "Sophie Bernard",
      technicien: "Luc Leclerc",
      debut: "2025-11-28 10:30",
      statut: "diagnostic",
      pourcentage: 30,
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
      header: "Technicien",
      accessor: "technicien",
    },
    {
      header: "Statut",
      accessor: "statut",
      cell: (row: any) => (
        <Badge className={row.statut === "en-cours" ? "bg-blue-500" : "bg-purple-500"}>
          {row.statut === "en-cours" ? "En cours" : "Diagnostic"}
        </Badge>
      ),
    },
    {
      header: "Progression",
      accessor: "pourcentage",
      cell: (row: any) => (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${row.pourcentage}%` }}
          />
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row: any) => (
        <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
          Terminer
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">En Cours</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Véhicules en cours de réparation ({vehicles.length})
        </p>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card3D>
          <div className="flex items-center gap-3">
            <Wrench size={32} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">En réparation</p>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <TrendingUp size={32} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Progression moyenne</p>
              <p className="text-2xl font-bold">
                {Math.round(vehicles.reduce((acc, v) => acc + v.pourcentage, 0) / vehicles.length)}%
              </p>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="text-center py-8">
          <Wrench size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Données en attente de chargement depuis la BD</p>
        </div>
      </div>
    </div>
  );
}
