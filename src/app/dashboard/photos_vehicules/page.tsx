"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image'
import { Eye, Edit3, Trash2, Check, AlertCircle } from 'lucide-react'
import DraggableModal from "@/app/components/ui/draggable-modal/DraggableModal";
import { useToast } from "@/hooks/use-toast";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ url: "", type: "ENTREE", vehicleId: "" });
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    let mounted = true
      ; (async function load() {
        try {
          const res = await fetch('/api/photos_vehicules')
          const data = await res.json()
          if (!mounted) return
          // API returns array directly, fallback to empty array if error
          setPhotos(Array.isArray(data) ? data : (data?.data || []))
        } catch (e) {
          if (!mounted) return
          setPhotos([])
        }
      })()
    return () => { mounted = false }
  }, [])

  async function create() {
    // If editing, remove previous entry first (simple demo behaviour)
    if (editingId) {
      await fetch(`/api/photos_vehicules?id=${editingId}`, { method: 'DELETE' })
    }

    try {
      await fetch('/api/photos_vehicules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setOpen(false)
      setEditingId(null)
      addToast({ title: 'Photo créée', description: 'La photo a été ajoutée avec succès', type: 'success' })
      // reload list
      const res = await fetch('/api/photos_vehicules')
      const data = await res.json()
      setPhotos(Array.isArray(data) ? data : (data?.data || []))
    } catch (e) {
      addToast({ title: 'Erreur', description: 'Impossible de créer la photo', type: 'error' })
      setPhotos([])
    }
  }

  const [viewOpen, setViewOpen] = useState(false)
  const [viewPhoto, setViewPhoto] = useState<any | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [editMockOpen, setEditMockOpen] = useState(false)

  async function deletePhoto(id: string) {
    // open confirmation modal
    setDeleteTargetId(id)
    setDeleteConfirmOpen(true)
  }

  async function doDelete() {
    if (!deleteTargetId) return
    try {
      await fetch(`/api/photos_vehicules/${deleteTargetId}`, { method: 'DELETE' })
      setDeleteConfirmOpen(false)
      setDeleteTargetId(null)
      addToast({ title: 'Photo supprimée', description: 'La photo a été supprimée avec succès', type: 'success' })
      // reload
      const res = await fetch('/api/photos_vehicules')
      const data = await res.json()
      setPhotos(Array.isArray(data) ? data : (data?.data || []))
    } catch (e) {
      addToast({ title: 'Erreur', description: 'Impossible de supprimer la photo', type: 'error' })
      setDeleteConfirmOpen(false)
      setDeleteTargetId(null)
    }
  }

  function handleEdit(p: any) {
    // Open mock edit modal
    setEditMockOpen(true)
  }

  async function openView(id: string) {
    try {
      const res = await fetch(`/api/photos_vehicules/${id}`)
      const data = await res.json()
      setViewPhoto(data)
      setViewOpen(true)
    } catch (e) {
      // fallback: try to find in loaded photos
      const found = photos.find((x) => x.id === id)
      setViewPhoto(found || null)
      setViewOpen(true)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Photos véhicules</h2>
        <button onClick={() => setOpen(true)} className="rounded bg-emerald-600 px-4 py-2 text-white">Ajouter</button>
      </div>

      {/* Top: 4 latest thumbnails */}
      <div className="mt-4">
        <div className="grid grid-cols-4 gap-4">
          {photos.slice(0, 4).map((p) => (
            <div key={p.id} className="relative rounded-lg overflow-hidden border bg-white dark:bg-gray-800 h-28">
              <div className="h-full w-full relative">
                <Image src={p.url || '/placeholder.svg'} alt={`photo-${p.id}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute left-3 bottom-2 text-white text-xs">
                  <div className="font-semibold">{p.vehicle?.immatricule || '-'}</div>
                  <div className="text-[11px]">{p.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table: all photos */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase">
              <th className="p-2">Photo</th>
              <th className="p-2">Type</th>
              <th className="p-2">Date</th>
              <th className="p-2">Immatriculation</th>
              <th className="p-2">Client</th>
              <th className="p-2">Photographe</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {photos.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2 align-top w-36">
                  <div className="h-20 w-32 relative rounded overflow-hidden">
                    <Image src={p.url || '/placeholder.svg'} alt={`photo-${p.id}`} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-2 align-top">{p.type}</td>
                <td className="p-2 align-top">{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</td>
                <td className="p-2 align-top">{p.vehicle?.immatricule || '-'}</td>
                <td className="p-2 align-top">{p.client?.name || p.client || '-'}</td>
                <td className="p-2 align-top">{p.takenBy?.name || '-'}</td>
                <td className="p-2 align-top">
                  <div className="flex items-center gap-2">
                    <button title="Voir" onClick={() => openView(p.id)} className="p-2 rounded bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-white"><Eye size={16} /></button>
                    <button title="Éditer" onClick={() => handleEdit(p)} className="p-2 rounded bg-yellow-500 text-white"><Edit3 size={16} /></button>
                    <button title="Supprimer" onClick={() => deletePhoto(p.id)} className="p-2 rounded bg-red-600 text-white"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DraggableModal isOpen={open} onClose={() => { setOpen(false); setEditingId(null) }} title="Ajouter photo véhicule">
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

      {/* View modal */}
      <DraggableModal isOpen={viewOpen} onClose={() => { setViewOpen(false); setViewPhoto(null) }} title="Détails photo">
        {viewPhoto ? (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 h-64 relative rounded overflow-hidden">
              <Image src={viewPhoto.url || '/placeholder.svg'} alt={`photo-${viewPhoto.id}`} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{viewPhoto.vehicle?.immatricule || '—'}</h3>
              <div className="text-sm text-gray-600 mt-2">Type: {viewPhoto.type}</div>
              <div className="text-sm text-gray-600 mt-2">Date: {viewPhoto.createdAt ? new Date(viewPhoto.createdAt).toLocaleString() : '-'}</div>
              <div className="text-sm text-gray-600 mt-2">Client: {viewPhoto.client?.name || viewPhoto.client || '-'}</div>
              <div className="text-sm text-gray-600 mt-2">Téléphone: {viewPhoto.client?.phone || '-'}</div>
              <div className="text-sm text-gray-600 mt-2">Technicien: {viewPhoto.takenBy?.name || '-'}</div>
            </div>
          </div>
        ) : (
          <div>Chargement...</div>
        )}
      </DraggableModal>

      {/* Edit mock modal */}
      <DraggableModal isOpen={editMockOpen} onClose={() => setEditMockOpen(false)} title="Édition (bientôt disponible)">
        <div className="p-4">
          <p>La modification des informations de photo est en cours de finalisation et sera disponible la semaine prochaine.</p>
          <div className="mt-4 flex justify-end">
            <button onClick={() => setEditMockOpen(false)} className="rounded bg-slate-600 px-4 py-2 text-white">Fermer</button>
          </div>
        </div>
      </DraggableModal>

      {/* Delete confirmation modal */}
      <DraggableModal isOpen={deleteConfirmOpen} onClose={() => { setDeleteConfirmOpen(false); setDeleteTargetId(null) }} title="Confirmer la suppression">
        <div className="p-4">
          <p>Voulez-vous vraiment supprimer cette photo ? Cette action est irréversible.</p>
          <div className="mt-4 flex gap-2 justify-end">
            <button onClick={() => { setDeleteConfirmOpen(false); setDeleteTargetId(null) }} className="rounded bg-slate-200 px-4 py-2">Annuler</button>
            <button onClick={doDelete} className="rounded bg-red-600 px-4 py-2 text-white">Supprimer</button>
          </div>
        </div>
      </DraggableModal>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg shadow-lg animate-in slide-in-from-right-full ${toast.type === 'success'
                ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : toast.type === 'error'
                  ? 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  : 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
              }`}
          >
            {toast.type === 'success' && (
              <Check className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={18} />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={18} />
            )}
            <div className="flex-1">
              <p className={`font-semibold ${toast.type === 'success'
                  ? 'text-green-900 dark:text-green-100'
                  : toast.type === 'error'
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-blue-900 dark:text-blue-100'
                }`}>
                {toast.title}
              </p>
              {toast.description && (
                <p className={`text-sm ${toast.type === 'success'
                    ? 'text-green-700 dark:text-green-200'
                    : toast.type === 'error'
                      ? 'text-red-700 dark:text-red-200'
                      : 'text-blue-700 dark:text-blue-200'
                  }`}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
