"use client";

import React, { useEffect, useState } from "react";
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";

type StockItem = {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  prixAchat: string;
  prixVente: string;
};

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<StockItem>>({});

  async function load() {
    setLoading(true);
    const res = await fetch('/api/stock_materiel');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load() }, []);

  async function create() {
    await fetch('/api/stock_materiel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setOpen(false)
    setForm({})
    load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Stock matériel</h2>
        <div>
          <button onClick={() => setOpen(true)} className="rounded bg-emerald-600 px-4 py-2 text-white">Ajouter</button>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Quantité</th>
                <th>Prix vente</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className="border-t">
                  <td className="py-2">{i.nom}</td>
                  <td>{i.categorie}</td>
                  <td>{i.quantite}</td>
                  <td>{i.prixVente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DraggableModal isOpen={open} onClose={() => setOpen(false)} title="Ajouter matériel">
        <div className="flex flex-col gap-3">
          <input placeholder="Nom" value={form.nom || ''} onChange={e => setForm(prev => ({ ...prev, nom: e.target.value }))} className="rounded border p-2" />
          <input placeholder="Catégorie" value={form.categorie || ''} onChange={e => setForm(prev => ({ ...prev, categorie: e.target.value }))} className="rounded border p-2" />
          <input type="number" placeholder="Quantité" value={form.quantite?.toString() || ''} onChange={e => setForm(prev => ({ ...prev, quantite: Number(e.target.value) }))} className="rounded border p-2" />
          <input placeholder="Prix vente" value={form.prixVente || ''} onChange={e => setForm(prev => ({ ...prev, prixVente: e.target.value }))} className="rounded border p-2" />

          <div className="flex justify-end">
            <button onClick={create} className="rounded bg-sky-600 px-4 py-2 text-white">Créer</button>
          </div>
        </div>
      </DraggableModal>
    </div>
  )
}
