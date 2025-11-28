"use client";

import React, { useState } from "react";
import { Archive, BarChart3 } from "lucide-react";
import TablePro from "@/components/ui/TablePro";
import Card3D from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";

export default function HistoriquePage() {
  const [interventions, setInterventions] = useState([
    {
      id: 1,
      immatricule: "AA-111-BB",
      vehicule: "Peugeot 206",
      client: "Jean Dupont",
      technicien: "Thomas Martin",
      debut: "2025-11-20",
      fin: "2025-11-21",
      duree: "8h30",
      cout: "325 €",
      statut: "facturee",
    },
    {
      id: 2,
      immatricule: "CC-222-DD",
      vehicule: "Renault Megane",
      client: "Marie Bernard",
      technicien: "Luc Leclerc",
      debut: "2025-11-18",
      fin: "2025-11-19",
      duree: "5h15",
      cout: "210 €",
      statut: "facturee",
    },
    {
      id: 3,
      immatricule: "EE-333-FF",
      vehicule: "Citroën C4",
      client: "Pierre Laurent",
      technicien: "Sophie Dupont",
      debut: "2025-11-15",
      fin: "2025-11-16",
      duree: "12h00",
      cout: "580 €",
      statut: "facturee",
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
      accessor: "vehicule",
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
      header: "Durée",
      accessor: "duree",
    },
    {
      header: "Coût",
      accessor: "cout",
      cell: (row: any) => <span className="font-semibold text-green-600">{row.cout}</span>,
    },
    {
      header: "Statut",
      accessor: "statut",
      cell: (row: any) => (
        <Badge className="bg-green-500">Facturée</Badge>
      ),
    },
  ];

  const statsData = [
    { label: "Interventions", value: interventions.length, icon: "📊" },
    { label: "Durée totale", value: "25h45", icon: "⏱️" },
    { label: "CA généré", value: "1 115 €", icon: "💰" },
    { label: "Coût moyen", value: "371 €", icon: "📈" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Historique Interventions</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interventions complétées et facturées
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, idx) => (
          <Card3D key={idx}>
            <div className="space-y-2">
              <p className="text-2xl">{stat.icon}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </Card3D>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="text-center py-8">
          <Archive size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Historique interventions - données en attente de chargement</p>
        </div>
      </div>
    </div>
  );
}
