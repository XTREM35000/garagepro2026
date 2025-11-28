"use client";

import React, { useState } from "react";
import { Plus, Edit3, Eye, Trash2, Users } from "lucide-react";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";
import { useToast } from "@/hooks/use-toast";

// Mock équipe data
const equipeMock = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@garage.com",
    role: "TECHNICIEN_SENIOR",
    specialty: "Mécanique moteur",
    phone: "01 23 45 67 89",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Jean-Pierre Martin",
    email: "jp.martin@garage.com",
    role: "TECHNICIEN",
    specialty: "Électrique automobile",
    phone: "01 34 56 78 90",
    status: "active",
    joinedAt: "2024-03-20",
  },
  {
    id: 3,
    name: "Sophie Leclerc",
    email: "sophie.leclerc@garage.com",
    role: "RECEPTIONNISTE",
    specialty: "Accueil clients",
    phone: "01 45 67 89 01",
    status: "active",
    joinedAt: "2024-02-10",
  },
  {
    id: 4,
    name: "Paul Bonnet",
    email: "paul.bonnet@garage.com",
    role: "CHEF_ATELIER",
    specialty: "Diagnostic",
    phone: "01 56 78 90 12",
    status: "active",
    joinedAt: "2023-11-05",
  },
  {
    id: 5,
    name: "Céline Mercier",
    email: "celine.mercier@garage.com",
    role: "TECHNICIEN",
    specialty: "Carrosserie",
    phone: "01 67 89 01 23",
    status: "active",
    joinedAt: "2024-04-01",
  },
];

const roleLabels: Record<string, string> = {
  CHEF_ATELIER: "Chef d'Atelier",
  ADMIN_ATELIER: "Admin Atelier",
  TECHNICIEN_SENIOR: "Technicien Senior",
  TECHNICIEN: "Technicien",
  RECEPTIONNISTE: "Réceptionniste",
  APPRENTI: "Apprenti",
};

const roleColors: Record<string, string> = {
  CHEF_ATELIER: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ADMIN_ATELIER: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  TECHNICIEN_SENIOR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  TECHNICIEN: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  RECEPTIONNISTE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  APPRENTI: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export default function EquipePage() {
  const [equipe, setEquipe] = useState(equipeMock);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "TECHNICIEN",
    specialty: "",
  });
  const [viewItem, setViewItem] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const handleAdd = () => {
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", role: "TECHNICIEN", specialty: "" });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      email: item.email,
      phone: item.phone,
      role: item.role,
      specialty: item.specialty,
    });
    setShowModal(true);
  };

  const handleView = (item: any) => {
    setViewItem(item);
    setViewOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId === null) return;
    setEquipe(equipe.filter((e) => e.id !== deleteConfirmId));
    addToast({
      title: "Membre supprimé",
      description: "Le membre a été supprimé avec succès",
      type: "success",
    });
    setDeleteConfirmId(null);
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) {
      addToast({
        title: "Erreur",
        description: "Nom et email sont requis",
        type: "error",
      });
      return;
    }

    if (editingId) {
      setEquipe(
        equipe.map((e) =>
          e.id === editingId
            ? {
              ...e,
              name: form.name,
              email: form.email,
              phone: form.phone,
              role: form.role,
              specialty: form.specialty,
            }
            : e
        )
      );
      addToast({
        title: "Membre modifié",
        description: "Les informations ont été mises à jour",
        type: "success",
      });
    } else {
      const newMember = {
        id: Math.max(...equipe.map((e) => e.id), 0) + 1,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        specialty: form.specialty,
        status: "active",
        joinedAt: new Date().toISOString().split("T")[0],
      };
      setEquipe([...equipe, newMember]);
      addToast({
        title: "Membre ajouté",
        description: "Le nouveau membre a été créé avec succès",
        type: "success",
      });
    }

    setShowModal(false);
    setForm({ name: "", email: "", phone: "", role: "TECHNICIEN", specialty: "" });
  };

  const recentEquipe = equipe.slice(-4).reverse();
  const tableColumns = ["Nom", "Email", "Rôle", "Spécialité", "Téléphone", "Statut", "Actions"];
  const tableData = equipe.map((item) => [
    item.name,
    item.email,
    roleLabels[item.role] || item.role,
    item.specialty,
    item.phone,
    item.status === "active" ? "🟢 Actif" : "🔴 Inactif",
    "ACTIONS",
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion Équipe</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérer les techniciens et personnels de l&apos;atelier</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-white"
        >
          <Plus size={18} />
          Ajouter un membre
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricsCard title="Membres total" value={equipe.length.toString()} icon="Users" />
        <MetricsCard title="Actifs" value={equipe.filter((e) => e.status === "active").length.toString()} icon="CheckCircle" />
        <MetricsCard title="Rôles" value={new Set(equipe.map((e) => e.role)).size.toString()} icon="Shield" />
      </div>

      {/* Recent Team Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Derniers membres ajoutés</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentEquipe.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.email}</p>
                </div>
              </div>
              <div
                className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${roleColors[item.role] || "bg-gray-100 text-gray-800"
                  }`}
              >
                {roleLabels[item.role] || item.role}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{item.specialty}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(item)}
                  className="flex-1 py-1 px-2 text-xs rounded bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-white"
                >
                  <Eye size={14} className="inline mr-1" /> Voir
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 py-1 px-2 text-xs rounded bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                >
                  <Edit3 size={14} className="inline mr-1" /> Éditer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card3D>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tous les membres</h3>
          <span className="text-sm text-gray-500">{equipe.length} membres</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {tableColumns.map((col) => (
                  <th key={col} className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {equipe.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3 font-semibold">{item.name}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{item.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${roleColors[item.role]}`}>
                      {roleLabels[item.role]}
                    </span>
                  </td>
                  <td className="p-3">{item.specialty}</td>
                  <td className="p-3">{item.phone}</td>
                  <td className="p-3">{item.status === "active" ? "🟢 Actif" : "🔴 Inactif"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="p-2 rounded bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-white hover:bg-slate-200"
                        title="Voir"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                        title="Éditer"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded bg-red-600 text-white hover:bg-red-700"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card3D>

      {/* Add/Edit Modal */}
      <DraggableModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Éditer un membre" : "Ajouter un membre"}
      >
        <div className="flex flex-col gap-4 p-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Marie Dubois"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="marie@garage.com"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Téléphone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01 23 45 67 89"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Rôle</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Spécialité</label>
            <input
              type="text"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              placeholder="Mécanique, Électrique, Carrosserie..."
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingId ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </div>
      </DraggableModal>

      {/* View Modal */}
      <DraggableModal isOpen={viewOpen} onClose={() => setViewOpen(false)} title="Détails du membre">
        {viewItem && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {viewItem.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{viewItem.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{viewItem.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Rôle</p>
                <p className="font-semibold">{roleLabels[viewItem.role]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Spécialité</p>
                <p className="font-semibold">{viewItem.specialty}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Téléphone</p>
                <p className="font-semibold">{viewItem.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Statut</p>
                <p className="font-semibold">{viewItem.status === "active" ? "🟢 Actif" : "🔴 Inactif"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Ajouté le</p>
                <p className="font-semibold">{new Date(viewItem.joinedAt).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  setViewOpen(false);
                  handleEdit(viewItem);
                }}
                className="flex-1 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center gap-2"
              >
                <Edit3 size={16} /> Éditer
              </button>
              <button
                onClick={() => {
                  setViewOpen(false);
                  handleDelete(viewItem.id);
                }}
                className="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Supprimer
              </button>
            </div>
          </div>
        )}
      </DraggableModal>

      {/* Delete Confirmation Modal */}
      <DraggableModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmer la suppression"
      >
        <div className="p-4">
          <p className="mb-6">Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
              Supprimer
            </button>
          </div>
        </div>
      </DraggableModal>

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg shadow-lg ${toast.type === "success"
              ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
              : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
              }`}
          >
            <div className="flex-1">
              <p className={`font-semibold ${toast.type === "success" ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"}`}>
                {toast.title}
              </p>
              {toast.description && (
                <p className={`text-sm ${toast.type === "success" ? "text-green-700 dark:text-green-200" : "text-red-700 dark:text-red-200"}`}>
                  {toast.description}
                </p>
              )}
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
