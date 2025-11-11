"use client";

import React, { useEffect, useState } from "react";
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ url: "", type: "ENTREE", vehicleId: "" });

  async function load() {
    const res = await fetch('/api/photos_vehicules');
    const data = await res.json();
    setPhotos(data);
  }

  useEffect(() => { load() }, [])

  async function create() {
    await fetch('/api/photos_vehicules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setOpen(false)
    load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Photos véhicules</h2>
        <button onClick={() => setOpen(true)} className="rounded bg-emerald-600 px-4 py-2 text-white">Ajouter</button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {photos.map(p => (
          <div key={p.id} className="rounded border p-2">
            <img src={p.url} alt="photo" className="h-40 w-full object-cover" />
            <div className="mt-2 text-sm text-gray-600">Type: {p.type}</div>
            <div className="text-sm text-gray-600">Véhicule: {p.vehicle?.immatricule}</div>
          </div>
        ))}
      </div>

      <DraggableModal isOpen={open} onClose={() => setOpen(false)} title="Ajouter photo véhicule">
        <div className="flex flex-col gap-3">
          <input placeholder="URL image" value={form.url} onChange={e => setForm(prev => ({ ...prev, url: e.target.value }))} className="rounded border p-2" />
          <input placeholder="Vehicle ID" value={form.vehicleId} onChange={e => setForm(prev => ({ ...prev, vehicleId: e.target.value }))} className="rounded border p-2" />
          <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))} className="rounded border p-2">
            <option value="ENTREE">ENTREE</option>
            <option value="SORTIE">SORTIE</option>
            <option value="DEGAT">DEGAT</option>
          </select>

          <div className="flex justify-end">
            <button onClick={create} className="rounded bg-sky-600 px-4 py-2 text-white">Créer</button>
          </div>
        </div>
      </DraggableModal>
    </div>
  )
}
