"use client";

import React from "react";
import MetricsCard from "@/components/dashboard/MetricsCard";
import { BarChart3, TrendingUp, AlertCircle, Clock } from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vue Globale Atelier</h1>
        <p className="text-gray-600 dark:text-gray-400">Synthèse en temps réel de l&apos;atelier</p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard title="Interventions en cours" value={12} icon="Activity" />
        <MetricsCard title="En attente" value={5} icon="Clock" />
        <MetricsCard title="Pièces manquantes" value={3} icon="AlertCircle" />
        <MetricsCard title="CA du jour" value="45 000 FCFA" icon="TrendingUp" />
      </div>

      {/* Sections détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-blue-500" />
            <h3 className="font-semibold">Interventions en cours</h3>
          </div>
          <p className="text-sm text-gray-500">Les 5 dernières interventions actives</p>
          <div className="mt-4 space-y-2">
            {/* TODO: Charger depuis BD */}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-amber-500" />
            <h3 className="font-semibold">Alertes</h3>
          </div>
          <p className="text-sm text-gray-500">Pièces en rupture de stock</p>
          <div className="mt-4 space-y-2">
            {/* TODO: Charger alertes */}
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-emerald-500" />
            <h3 className="font-semibold">Performance du jour</h3>
          </div>
          <p className="text-sm text-gray-500">Statistiques par technicien</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* TODO: Charger stats */}
          </div>
        </div>
      </div>
    </div>
  );
}
