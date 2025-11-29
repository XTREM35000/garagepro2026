"use client";

import React from 'react'
import Link from 'next/link'
import { mockReceptions, mockClients, mockVehicles } from '@/lib/mocks_reception'

export default function ReceptionListPage() {
  const [items, setItems] = React.useState(mockReceptions)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Réceptions</h1>
        <Link href="/dashboard/reception/nouveau" className="btn">Nouvelle réception</Link>
      </div>

      <div className="grid gap-4">
        {items.map(r => {
          const client = mockClients.find(c => c.id === r.clientId)
          const vehicle = mockVehicles.find(v => v.id === r.vehicleId)
          return (
            <div key={r.id} className="border rounded p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.numeroBT} — {client?.nom} {client?.prenom}</div>
                <div className="text-sm text-muted-foreground">{vehicle?.immatriculation} · {r.motifVisite} · {r.urgence}</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/reception/${r.id}`} className="btn btn-sm">Voir</Link>
                <button className="btn btn-ghost btn-sm" onClick={async () => {
                  await fetch(`/api/reception/${r.id}`, { method: 'DELETE' })
                  setItems(items.filter(x => x.id !== r.id))
                }}>Supprimer</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
