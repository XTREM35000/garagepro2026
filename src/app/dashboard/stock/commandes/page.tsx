"use client";

import React, { useState } from "react";
import { Truck, AlertTriangle, Calendar, Package } from "lucide-react";
import TablePro from "@/components/ui/TablePro";
import Card3D from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";

export default function CommandesPage() {
  const [commandes, setCommandes] = useState([
    {
      id: 1,
      numero: "CMD-2025-001",
      fournisseur: "AutoParts France",
      date: "2025-11-28",
      livraison: "2025-12-05",
      montant: "1 250 €",
      statut: "en-cours",
      pieces: 8,
    },
    {
      id: 2,
      numero: "CMD-2025-002",
      fournisseur: "EuroMecanique",
      date: "2025-11-27",
      livraison: "2025-11-30",
      montant: "580 €",
      statut: "livree",
      pieces: 5,
    },
    {
      id: 3,
      numero: "CMD-2025-003",
      fournisseur: "Bosch Rhénia",
      date: "2025-11-26",
      livraison: "2025-12-10",
      montant: "3 420 €",
      statut: "en-cours",
      pieces: 15,
    },
  ]);

  const columns = [
    {
      header: "Numéro",
      accessor: "numero",
      cell: (row: any) => <span className="font-mono font-bold">{row.numero}</span>,
    },
    {
      header: "Fournisseur",
      accessor: "fournisseur",
    },
    {
      header: "Pièces",
      accessor: "pieces",
    },
    {
      header: "Montant",
      accessor: "montant",
      cell: (row: any) => <span className="font-semibold">{row.montant}</span>,
    },
    {
      header: "Livraison prévue",
      accessor: "livraison",
    },
    {
      header: "Statut",
      accessor: "statut",
      cell: (row: any) => (
        <Badge className={row.statut === "livree" ? "bg-green-500" : "bg-blue-500"}>
          {row.statut === "livree" ? "Livrée" : "En cours"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row: any) => (
        <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
          Détail
        </button>
      ),
    },
  ];

  const totalCommande = "5 250 €";
  const enAttente = "4 670 €";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Commandes Fournisseurs</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Suivi des commandes de pièces détachées
        </p>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card3D>
          <div className="flex items-center gap-3">
            <Truck size={32} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Commandes actives</p>
              <p className="text-2xl font-bold">
                {commandes.filter((c) => c.statut === "en-cours").length}
              </p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <Calendar size={32} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">En attente livraison</p>
              <p className="text-lg font-bold">{enAttente}</p>
            </div>
          </div>
        </Card3D>
        <Card3D>
          <div className="flex items-center gap-3">
            <AlertTriangle size={32} className="text-amber-500" />
            <div>
              <p className="text-sm text-gray-600">Total commandes</p>
              <p className="text-lg font-bold">{totalCommande}</p>
            </div>
          </div>
        </Card3D>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="text-center py-8">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Commandes fournisseurs - données en attente de chargement</p>
        </div>
      </div>
    </div>
  );
}
