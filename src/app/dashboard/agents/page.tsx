"use client";
import React, { useEffect, useState } from "react";
import HeroBanner from "@/components/hero/HeroBanner";
import BackButton from "@/components/ui/BackButton";
import Card3D from "@/components/ui/Card3D";
import MetricsCard from "@/components/dashboard/MetricsCard";
import TablePro from "@/components/ui/TablePro";
import ModalPro from "@/components/ui/ModalPro";
import { UserPlus, Trash2, Edit2 } from "lucide-react";

type Agent = { id: string; email: string; name?: string; role: string; tenantId: string; };

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", name: "", role: "VIEWER", tenantId: "demo" });

  // reusable loader used by effects and handlers
  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/agents')
      const data = await res.json()
      setAgents(data || [])
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    // call load and guard against state updates after unmount
    void (async () => {
      try {
        await load()
      } catch { }
    })()
    return () => { mounted = false }
  }, []);

  // Open add modal if URL hash is '#add' (allows hero button to trigger modal)
  useEffect(() => {
    function checkHash() {
      if (typeof window === 'undefined') return;
      if (window.location.hash === '#add') {
        setEditingId(null); setForm({ email: "", name: "", role: "VIEWER", tenantId: "demo" }); setOpen(true);
      }
    }
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  function openAdd() { setEditingId(null); setForm({ email: "", name: "", role: "VIEWER", tenantId: "demo" }); setOpen(true); }
  function openEdit(a: Agent) { setEditingId(a.id); setForm({ email: a.email, name: a.name || "", role: a.role, tenantId: a.tenantId }); setOpen(true); }

  async function save() {
    if (!form.email) { alert("Email requis"); return; }
    if (editingId) {
      await fetch('/api/agents', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...form }) });
    } else {
      await fetch('/api/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setOpen(false); load();
  }

  async function deleteAgent(id: string) {
    if (!confirm("Supprimer cet agent ?")) return;
    await fetch(`/api/agents?id=${id}`, { method: 'DELETE' });
    load();
  }

  const columns = ["Email", "Nom", "Rôle", "Tenant", "Actions"];
  const data = agents.map(a => [
    <div key={`profile-${a.id}`} className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[rgba(37,211,102,0.12)] flex items-center justify-center text-[hsl(var(--brand)/1)] font-semibold">
        {(a.name || a.email || "U").charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="text-sm font-medium">{a.email}</div>
        <div className="text-xs text-gray-500">{a.name || "—"}</div>
      </div>
    </div>,
    a.name || "—",
    <span key={`role-${a.id}`} className={`badge badge--role ${a.role === 'SUPER_ADMIN' ? 'green' : ''}`}>{a.role}</span>,
    <div key={`tenant-${a.id}`} className="text-sm text-gray-600">{a.tenantId}</div>,
    <div key={`actions-${a.id}`} className="flex gap-2">
      <button onClick={() => openEdit(a)} title="Éditer" className="p-2 rounded-md hover:bg-gray-100"><Edit2 size={16} /></button>
      <button onClick={() => deleteAgent(a.id)} title="Supprimer" className="p-2 rounded-md hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
    </div>
  ]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto -mt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-2xl font-semibold">Agents</h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[hsl(var(--brand)/1)] text-white px-4 py-2 rounded-xl shadow-greenGlow">
              <UserPlus size={16} /> Ajouter agent
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricsCard title="Total agents" value={agents.length} icon={UserPlus} />
          <MetricsCard title="Admins" value={agents.filter(a => a.role === 'TENANT_ADMIN').length} icon={Edit2} />
          <MetricsCard title="Super admins" value={agents.filter(a => a.role === 'SUPER_ADMIN').length} icon={Trash2} />
        </div>

        <Card3D>
          {loading ? <div className="py-8 text-center">Chargement...</div> :
            agents.length === 0 ? <div className="py-8 text-center text-gray-500">Aucun agent trouvé</div> :
              <TablePro columns={columns} data={data} />
          }
        </Card3D>
      </div>

      <ModalPro open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full rounded border px-3 py-2" disabled={!!editingId} />

          <label className="text-sm font-medium">Nom</label>
          <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full rounded border px-3 py-2" />

          <label className="text-sm font-medium">Rôle</label>
          <select value={form.role} onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))} className="w-full rounded border px-3 py-2">
            {['SUPER_ADMIN', 'TENANT_ADMIN', 'AGENT_PHOTO', 'CAISSIER', 'COMPTABLE', 'COMPTABLE_INSTANCE', 'TECHNICIEN', 'VIEWER'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <label className="text-sm font-medium">Tenant ID</label>
          <input value={form.tenantId} onChange={(e) => setForm(prev => ({ ...prev, tenantId: e.target.value }))} className="w-full rounded border px-3 py-2" />

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setOpen(false)} className="rounded border px-4 py-2 hover:bg-gray-100">Annuler</button>
            <button onClick={save} className="rounded px-4 py-2 bg-[hsl(var(--brand)/1)] text-white">Enregistrer</button>
          </div>
        </div>
      </ModalPro>
    </div>
  );
}
