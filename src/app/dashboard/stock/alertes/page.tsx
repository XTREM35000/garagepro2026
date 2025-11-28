"use client";

import React, { useState } from "react";
import { AlertCircle, TrendingDown, Zap } from "lucide-react";
import TablePro from "@/components/ui/TablePro";
import Card3D from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";

export default function AlertesPage() {
  const [alertes, setAlertes] = useState([
    {
      id: 1,
      piece: "Plaquettes de frein",
      reference: "PF-001",
      stock: 2,
      seuil: 5,
      prix: "45 €",
      alerte: "rupture-imminente",
      fournisseur: "Bosch",
    },
    {
      id: 2,
      piece: "Filtres à huile",
      reference: "FO-045",
      stock: 1,
      seuil: 3,
      prix: "12 €",
      alerte: "rupture-imminente",
      fournisseur: "Mann",
    },
    {
      id: 3,
      piece: "Amortisseurs avant",
      reference: "AMO-120",
      stock: 0,
      seuil: 2,
      prix: "120 €",
      alerte: "rupture",
      fournisseur: "KYB",
    },
    {
      id: 4,
      piece: "Courroie de distribution",
      reference: "COUR-88",
      stock: 3,
      seuil: 5,
      prix: "65 €",
      alerte: "stock-faible",
      fournisseur: "Gates",
    },
  ]);

  const columns = [
    {
      header: "Pièce",
      accessor: "piece",
    },
    {
      header: "Référence",
      accessor: "reference",
      cell: (row: any) => <span className="font-mono text-sm">{row.reference}</span>,
    },
    {
      header: "Stock",
      accessor: "stock",
      cell: (row: any) => (
        <span className={row.stock === 0 ? "text-red-600 font-bold" : ""}>
          {row.stock}
        </span>
      ),
    },
    {
      header: "Seuil",
      accessor: "seuil",
    },
    {
      header: "Fournisseur",
      accessor: "fournisseur",
    },
    {
      header: "Alerte",
      accessor: "alerte",
      cell: (row: any) => (
        <Badge
          className={
            row.alerte === "rupture"
              ? "bg-red-500"
              : row.alerte === "rupture-imminente"
                ? "bg-orange-500"
                : "bg-yellow-500"
          }
        >
          {row.alerte === "rupture"
            ? "Rupture"
            : row.alerte === "rupture-imminente"
              ? "Rupture imminente"
              : "Stock faible"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row: any) => (
        <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          Commander
        </button>
      ),
    },
  ];

  const ruptures = alertes.filter((a) => a.alerte === "rupture").length;
  const imminentes = alertes.filter((a) => a.alerte === "rupture-imminente").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Alertes Stock</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Suivi des pièces en rupture de stock ou seuil faible
        </p>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card3D>
          <div className="flex items-center gap-3">
            <AlertCircle size={32} className="text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Ruptures</p>
              <p className="text-2xl font-bold text-red-600">{ruptures}</p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <TrendingDown size={32} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Ruptures imminentes</p>
              <p className="text-2xl font-bold text-orange-600">{imminentes}</p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <Zap size={32} className="text-amber-500" />
            <div>
              <p className="text-sm text-gray-600">Total à commander</p>
              <p className="text-2xl font-bold">242 €</p>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Notifications prioritaires */}
      {ruptures > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800 dark:text-red-200 font-semibold">
            ⚠️ {ruptures} pièce(s) en rupture de stock - Action immédiate requise !
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="text-center py-8">
          <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Alertes stock - données en attente de chargement</p>
        </div>
      </div>
    </div>
  );
}
