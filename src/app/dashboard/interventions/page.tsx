"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";
import {
  Clock,
  AlertCircle,
  TrendingUp,
  Zap,
  Settings2,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

export default function InterventionsPage() {
  const [filterStatus, setFilterStatus] = useState("TOUS");

  // Métriques KPI
  const metrics = [
    { title: "En cours", value: "12", icon: "Zap", change: "+2 aujourd'hui" },
    { title: "Temps moyen", value: "3.2h", icon: "Clock", change: "-0.5h" },
    { title: "Chiffre d'affaires", value: "45.2K", icon: "TrendingUp", change: "+12%" },
    { title: "Retards alertes", value: "3", icon: "AlertCircle", change: "-1 hier" },
  ];

  // Données réalistes des interventions
  const interventions = [
    {
      id: "INT-2025-001",
      priority: "URGENTE",
      client: "Kouadio Serge",
      vehicle: "Toyota Corolla GR-1000-AB",
      type: "Diagnostic",
      technician: "Jean Kouakou",
      dueDate: "2025-11-20",
      status: "EN_COURS",
      progress: 65,
      estimated: "2.5h",
      cost: "85.000",
    },
    {
      id: "INT-2025-002",
      priority: "HAUTE",
      client: "Konan Ahou",
      vehicle: "Honda Civic DK-1001-CD",
      type: "Freinage",
      technician: "Marie Yao",
      dueDate: "2025-11-21",
      status: "DIAGNOSTIC",
      progress: 30,
      estimated: "1.8h",
      cost: "65.000",
    },
    {
      id: "INT-2025-003",
      priority: "NORMALE",
      client: "Adélaïde Traoré",
      vehicle: "Peugeot 308 AB-1002-EF",
      type: "Entretien",
      technician: "Pierre Diallo",
      dueDate: "2025-11-18",
      status: "TERMINE",
      progress: 100,
      estimated: "1.5h",
      cost: "45.000",
    },
    {
      id: "INT-2025-004",
      priority: "BASSE",
      client: "Bamba Ibrahim",
      vehicle: "Hyundai i20 BD-1003-GH",
      type: "Suspension",
      technician: "Jean Kouakou",
      dueDate: "2025-10-30",
      status: "EN_ATTENTE",
      progress: 0,
      estimated: "2.0h",
      cost: "120.000",
    },
    {
      id: "INT-2025-005",
      priority: "HAUTE",
      client: "Traoré Moussa",
      vehicle: "Renault Clio CD-1004-IJ",
      type: "Moteur",
      technician: "Marie Yao",
      dueDate: "2025-11-22",
      status: "EN_COURS",
      progress: 45,
      estimated: "3.5h",
      cost: "185.000",
    },
    {
      id: "INT-2025-006",
      priority: "NORMALE",
      client: "Yapi Sophie",
      vehicle: "Mazda 3 EF-1005-KL",
      type: "Électricité",
      technician: "Pierre Diallo",
      dueDate: "2025-11-19",
      status: "FACTURE",
      progress: 100,
      estimated: "2.0h",
      cost: "95.000",
    },
  ];

  // Filtrer les données
  const filteredData = interventions.filter(
    (int) => filterStatus === "TOUS" || int.status === filterStatus
  );

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      EN_ATTENTE: "bg-gray-100 text-gray-800",
      DIAGNOSTIC: "bg-blue-100 text-blue-800",
      DEVIS_ENVOYE: "bg-purple-100 text-purple-800",
      EN_COURS: "bg-yellow-100 text-yellow-800",
      TERMINE: "bg-green-100 text-green-800",
      FACTURE: "bg-emerald-100 text-emerald-800",
      PAYE: "bg-teal-100 text-teal-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Fonction pour obtenir la couleur de priorité
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      BASSE: "text-gray-500",
      NORMALE: "text-blue-500",
      HAUTE: "text-orange-500",
      URGENTE: "text-red-500",
    };
    return colors[priority] || "text-gray-500";
  };

  const columns = [
    "ID",
    "Priorité",
    "Client/Véhicule",
    "Type",
    "Technicien",
    "Statut",
    "Progression",
    "Échéance",
    "Coût",
    "Actions",
  ];

  const tableData = filteredData.map((int) => [
    int.id,
    `🔴 ${int.priority}`,
    `${int.client}\n${int.vehicle}`,
    int.type,
    int.technician,
    int.status,
    `${int.progress}%`,
    int.dueDate,
    `${int.cost} CFA`,
    "👁️ ✏️ 🗑️",
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des Interventions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Suivi complet du workflow de réparation
            </p>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
            <Plus size={20} />
            Nouvelle intervention
          </button>
        </div>
      </motion.div>

      {/* Métriques KPI */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {metrics.map((metric, idx) => (
          <Card3D key={idx}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {metric.value}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    {metric.change}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 p-3 rounded-lg">
                  <Zap size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </Card3D>
        ))}
      </motion.div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex gap-3 flex-wrap"
      >
        {["EN_ATTENTE", "DIAGNOSTIC", "EN_COURS", "TERMINE", "FACTURE"].map(
          (status) => {
            // Couleurs et icônes pour chaque statut
            const statusConfig: Record<string, { bg: string; text: string; icon: string; border: string }> = {
              EN_ATTENTE: { bg: "from-gray-400 to-gray-500", text: "text-white", icon: "⏳", border: "border-gray-300" },
              DIAGNOSTIC: { bg: "from-blue-500 to-blue-600", text: "text-white", icon: "🔍", border: "border-blue-400" },
              EN_COURS: { bg: "from-yellow-500 to-amber-600", text: "text-white", icon: "⚙️", border: "border-yellow-400" },
              TERMINE: { bg: "from-green-500 to-emerald-600", text: "text-white", icon: "✅", border: "border-green-400" },
              FACTURE: { bg: "from-purple-500 to-indigo-600", text: "text-white", icon: "💳", border: "border-purple-400" },
            };

            const config = statusConfig[status];
            const isActive = filterStatus === status;

            return (
              <motion.button
                key={status}
                onClick={() => setFilterStatus(status)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2
                  ${isActive
                    ? `bg-gradient-to-r ${config.bg} ${config.text} shadow-lg border-2 ${config.border}`
                    : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700`
                  }
                `}
              >
                <span>{config.icon}</span>
                {status}
              </motion.button>
            );
          }
        )}
      </motion.div>

      {/* Tableau principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card3D>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Interventions en cours ({filteredData.length})
              </h3>
              <motion.button
                onClick={() => setFilterStatus("TOUS")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2
                  ${filterStatus === "TOUS"
                    ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg border-2 border-gray-400"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
              >
                <span>📋</span>
                TOUS
              </motion.button>
            </div>
            <div className="h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-gray-50 dark:bg-gray-900/20 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {(() => {
                      const colWidths = [
                        "w-28",
                        "w-24",
                        "w-72",
                        "w-36",
                        "w-36",
                        "w-32",
                        "w-36",
                        "w-28",
                        "w-24",
                        "w-36",
                      ];
                      return columns.map((col, idx) => (
                        <th
                          key={col}
                          className={`${colWidths[idx]} px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300`}
                        >
                          {col}
                        </th>
                      ));
                    })()}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((int, idx) => (
                    <motion.tr
                      key={int.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white truncate">
                        <div className="truncate max-w-[160px]">{int.id}</div>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${getPriorityColor(int.priority)} truncate`}>
                        <div className="truncate max-w-[120px]">{int.priority}</div>
                      </td>
                      <td className="px-4 py-3 max-w-[340px]">
                        <div className="text-gray-900 dark:text-white font-medium truncate max-w-full">{int.client}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full">{int.vehicle}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                        {int.type}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                        {int.technician}
                      </td>
                      <td className="px-4 py-3 truncate max-w-[140px]">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(int.status)}`}>
                          {int.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                            style={{ width: `${int.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {int.progress}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs truncate max-w-[120px]">
                        {int.dueDate}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                        {int.cost}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded text-yellow-600 dark:text-yellow-400 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card3D>
      </motion.div>

      {/* Info supplémentaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm"
      >
        📊 Total: {interventions.length} interventions | 💰 Chiffre d&apos;affaires: 595.000 CFA
      </motion.div>
    </div>
  );
}
