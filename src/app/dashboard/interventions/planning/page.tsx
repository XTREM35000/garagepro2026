"use client";

import React, { useState } from "react";
import { Calendar, Users } from "lucide-react";
import Card3D from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";

export default function PlanningPage() {
  const [techniciens] = useState([
    { id: 1, nom: "Thomas Martin", interventions: 4, capacite: 8 },
    { id: 2, nom: "Luc Leclerc", interventions: 6, capacite: 8 },
    { id: 3, nom: "Sophie Dupont", interventions: 3, capacite: 8 },
  ]);

  const [interventions] = useState([
    {
      id: 1,
      date: "28/11",
      heure: "09:00",
      technicien: "Thomas Martin",
      vehicule: "Peugeot 308",
      client: "Jean Dupont",
      statut: "en-cours",
      duree: "2h",
    },
    {
      id: 2,
      date: "28/11",
      heure: "11:00",
      technicien: "Luc Leclerc",
      vehicule: "Renault Clio",
      client: "Marie Martin",
      statut: "en-attente",
      duree: "1h30",
    },
    {
      id: 3,
      date: "29/11",
      heure: "09:00",
      technicien: "Sophie Dupont",
      vehicule: "Citroën C3",
      client: "Pierre Durand",
      statut: "planifiee",
      duree: "2h30",
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Planning Techniciens</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestion des ressources et affectation des interventions
        </p>
      </div>

      {/* Charge de travail */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Charge de Travail</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {techniciens.map((tech) => (
            <Card3D key={tech.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{tech.nom}</p>
                    <p className="text-sm text-gray-600">
                      {tech.interventions} / {tech.capacite} interventions
                    </p>
                  </div>
                  <Badge className={tech.interventions > 6 ? "bg-red-500" : "bg-green-500"}>
                    {Math.round((tech.interventions / tech.capacite) * 100)}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${tech.interventions > 6 ? "bg-red-500" : "bg-green-500"
                      }`}
                    style={{ width: `${(tech.interventions / tech.capacite) * 100}%` }}
                  />
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>

      {/* Planning détail */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Interventions du Jour</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          {interventions.map((inter) => (
            <div
              key={inter.id}
              className="flex items-start gap-4 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-lg">{inter.heure}</span>
                  <Badge className={inter.statut === "en-cours" ? "bg-green-500" : "bg-yellow-500"}>
                    {inter.statut === "en-cours" ? "En cours" : inter.statut === "en-attente" ? "En attente" : "Planifiée"}
                  </Badge>
                </div>
                <p className="font-semibold">{inter.vehicule}</p>
                <p className="text-sm text-gray-600">{inter.client}</p>
                <p className="text-sm text-gray-500 mt-1">{inter.technicien} • {inter.duree}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
