"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import Link from "next/link";

export default function InterventionDetailPage() {
  const params = useParams();
  const id = params.id;

  // TODO: Charger intervention depuis BD via ID
  const [intervention, setIntervention] = useState<any>({
    id,
    status: "EN_COURS",
    vehicle: { marque: "Toyota", modele: "Corolla", immatricule: "ABC-123" },
    technician: { nom: "Ali Diallo" },
    priority: "HAUTE",
    title: "Révision moteur",
    description: "Révision complète du moteur",
    diagnosis: "Filtre à air encrassé, liquide moteur à changer",
    progress: 65,
    startDate: new Date("2025-11-28"),
    estimatedEndDate: new Date("2025-11-29"),
    estimatedCost: 50000,
    partsCost: 20000,
    laborCost: 30000,
  });

  const statusColors: Record<string, string> = {
    EN_ATTENTE: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    DIAGNOSTIC: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    EN_COURS: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
    TERMINE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    FACTURE: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/interventions">
          <ArrowLeft className="w-6 h-6 cursor-pointer hover:text-blue-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Intervention #{id}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {intervention.vehicle?.marque} {intervention.vehicle?.modele}
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Statut</span>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[intervention.status]}`}>
            {intervention.status}
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-amber-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Priorité</span>
          </div>
          <p className="font-semibold">{intervention.priority}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-emerald-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Coût estimé</span>
          </div>
          <p className="font-semibold">{intervention.estimatedCost?.toLocaleString()} FCFA</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Progression</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${intervention.progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold">{intervention.progress}%</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Intervention Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Diagnostic */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Diagnostic</h3>
            <p className="text-gray-700 dark:text-gray-300">{intervention.diagnosis}</p>
          </div>

          {/* Pièces utilisées */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Pièces Utilisées</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">TODO: Charger pièces depuis BD</p>
            </div>
          </div>

          {/* Temps passé */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Suivi du Temps</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">TODO: Charger entrées temps depuis BD</p>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Technicien */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Technicien Affecté</p>
            <p className="font-semibold">{intervention.technician?.nom || "Non assigné"}</p>
          </div>

          {/* Véhicule */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Véhicule</p>
            <p className="font-semibold text-sm">
              {intervention.vehicle?.marque} {intervention.vehicle?.modele}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {intervention.vehicle?.immatricule}
            </p>
          </div>

          {/* Coûts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Détail Coûts</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Main d&apos;œuvre:</span>
                <span className="font-semibold">{intervention.laborCost?.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pièces:</span>
                <span className="font-semibold">{intervention.partsCost?.toLocaleString()} FCFA</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-bold text-lg">{intervention.estimatedCost?.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold">
              Mettre à jour
            </button>
            <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 text-sm font-semibold">
              Terminer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
