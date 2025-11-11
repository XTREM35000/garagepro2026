"use client";

import React, { useEffect, useState } from "react";
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";

type Agent = {
  id: string;
  email: string;
  name?: string;
  role: string;
  tenantId: string;
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", name: "", role: "viewer", tenantId: "demo" });

  async function load() {
    setLoading(true);
    const res = await fetch('/api/agents');
    const data = await res.json();
    setAgents(data);
    setLoading(false);
  }

  useEffect(() => { load() }, []);

  function openAdd() {
    setEditingId(null);
    setForm({ email: "", name: "", role: "viewer", tenantId: "demo" });
    setOpen(true);
  }

  function openEdit(agent: Agent) {
    setEditingId(agent.id);
    setForm({ email: agent.email, name: agent.name || "", role: agent.role, tenantId: agent.tenantId });
    setOpen(true);
  }

  async function save() {
    if (!form.email) {
      alert("Email requis");
      return;
    }

    if (editingId) {
      // Update
      await fetch('/api/agents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form })
      });
    } else {
      // Create (note: creating via API without password may need adjustment for full signup flow)
      await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }

    setOpen(false);
    load();
  }

  async function deleteAgent(id: string) {
    if (!confirm("Supprimer cet agent ?")) return;
    await fetch(`/api/agents?id=${id}`, { method: 'DELETE' });
    load();
  }

  const roleOptions = ['super_admin', 'admin', 'agent_photo', 'caissier', 'comptable', 'comptable_instance', 'technicien', 'viewer'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Gestion des agents</h1>
        <button onClick={openAdd} className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
          + Ajouter agent
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : agents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Aucun agent trouvé</div>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Rôle</th>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{agent.email}</td>
                  <td className="px-4 py-3 text-sm">{agent.name || "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {agent.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{agent.tenantId}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(agent)} className="text-sky-600 hover:underline">Éditer</button>
                      <button onClick={() => deleteAgent(agent.id)} className="text-red-600 hover:underline">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DraggableModal isOpen={open} onClose={() => setOpen(false)} title={editingId ? "Éditer agent" : "Ajouter agent"}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="agent@example.com"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              disabled={!!editingId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              placeholder="Jean Dupont"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rôle</label>
            <select value={form.role} onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))} className="w-full rounded border px-3 py-2">
              {roleOptions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tenant ID</label>
            <input
              placeholder="demo"
              value={form.tenantId}
              onChange={(e) => setForm(prev => ({ ...prev, tenantId: e.target.value }))}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setOpen(false)} className="rounded border px-4 py-2 hover:bg-gray-100">Annuler</button>
            <button onClick={save} className="rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">Enregistrer</button>
          </div>
        </div>
      </DraggableModal>
    </div>
  );
}
