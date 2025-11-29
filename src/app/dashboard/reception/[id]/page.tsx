import React from 'react'
import Link from 'next/link'
import { mockReceptions, mockClients, mockVehicles } from '@/lib/mocks_reception'

export default function ReceptionDetailPage({ params }: { params: { id: string } }) {
  const id = params.id
  const rec = mockReceptions.find(r => r.id === id)
  if (!rec) return (<div className="p-6">Réception introuvable</div>)
  const client = mockClients.find(c => c.id === rec.clientId)
  const vehicle = mockVehicles.find(v => v.id === rec.vehicleId)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{rec.numeroBT}</h1>
        <Link href="/dashboard/reception" className="btn">Retour</Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-semibold">Client</h3>
          <div>{client?.nom} {client?.prenom}</div>
          <div className="text-sm">{client?.telephone} · {client?.email}</div>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold">Véhicule</h3>
          <div>{vehicle?.immatriculation} — {vehicle?.marque} {vehicle?.modele}</div>
          <div className="text-sm">VIN: {vehicle?.vin}</div>
        </div>
      </div>
      <div className="mt-6 border rounded p-4">
        <h3 className="font-semibold">Détails</h3>
        <div>Motif: {rec.motifVisite}</div>
        <div>Urgence: {rec.urgence}</div>
        <div>Statut: {rec.statut}</div>
      </div>
    </div>
  )
}
