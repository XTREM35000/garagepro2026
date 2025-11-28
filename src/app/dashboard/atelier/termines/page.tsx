"use client";

import React, { useState } from "react";
import { CheckCircle, FileText, DollarSign, CheckCircle2 } from "lucide-react";
import TablePro from "@/components/ui/TablePro";
import Card3D from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";

export default function TerminesPage() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      immatricule: "EE-345-FF",
      marque: "Toyota",
      modele: "Yaris",
      client: "Anne Rousseau",
      dateFin: "2025-11-26",
      cout: "450 €",
      facturation: "en-attente",
    },
    {
      id: 2,
      immatricule: "GG-678-HH",
      marque: "BMW",
      modele: "320",
      client: "Marc Laurent",
      dateFin: "2025-11-25",
      cout: "1200 €",
      facturation: "facturee",
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
      header: "Date fin",
      accessor: "dateFin",
    },
    {
      header: "Coût",
      accessor: "cout",
      cell: (row: any) => <span className="font-semibold text-green-600">{row.cout}</span>,
    },
    {
      header: "Facturation",
      accessor: "facturation",
      cell: (row: any) => (
        <Badge className={row.facturation === "facturee" ? "bg-green-500" : "bg-yellow-500"}>
          {row.facturation === "facturee" ? "Facturée" : "En attente"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row: any) => (
        <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          {row.facturation === "facturee" ? "Facture" : "Facturer"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Réparations Terminées</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Réparations terminées prêtes pour facturation ({vehicles.length})
        </p>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card3D>
          <div className="flex items-center gap-3">
            <CheckCircle size={32} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Terminées</p>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <FileText size={32} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">En attente facturation</p>
              <p className="text-2xl font-bold">
                {vehicles.filter((v) => v.facturation === "en-attente").length}
              </p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <DollarSign size={32} className="text-amber-500" />
            <div>
              <p className="text-sm text-gray-600">CA potentiel</p>
              <p className="text-2xl font-bold">1 650 €</p>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="text-center py-8">
          <CheckCircle2 size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Réparations terminées - données en attente de chargement</p>
        </div>
      </div>
    </div>
  );
}
