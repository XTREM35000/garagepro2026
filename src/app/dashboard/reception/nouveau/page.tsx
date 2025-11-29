"use client"
import React from 'react'
import { mockClients, mockVehicles, createReception } from '@/lib/mocks_reception'
import PhotoInspectionGuide from '@/components/reception/PhotoInspectionGuide'
import DamageSelector from '@/components/reception/DamageSelector'
import { useRouter } from 'next/navigation'

export default function NewReceptionPage() {
  const [step, setStep] = React.useState(0)
  const [clientId, setClientId] = React.useState(mockClients[0].id)
  const [vehicleId, setVehicleId] = React.useState(mockVehicles[0].id)
  const [motif, setMotif] = React.useState('Révision')
  const [urgence, setUrgence] = React.useState('NORMALE')
  const [damages, setDamages] = React.useState<any[]>([])
  const router = useRouter()

  const submit = async () => {
    const payload = { numeroBT: `BT-${Date.now()}`, clientId, vehicleId, motifVisite: motif, urgence }
    // use local mock create for now
    const created = createReception(payload as any)
    // call API to persist in future
    await fetch('/api/reception', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(created) })
    router.push(`/dashboard/reception/${created.id}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nouvelle réception</h1>
      <div className="space-y-4">
        {step === 0 && (
          <div>
            <h2 className="font-semibold">1 — Client</h2>
            <select value={clientId} onChange={e => setClientId(e.target.value)} className="border rounded p-2 mt-2">
              {mockClients.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
            </select>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-semibold">2 — Véhicule</h2>
            <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} className="border rounded p-2 mt-2">
              {mockVehicles.map(v => <option key={v.id} value={v.id}>{v.immatriculation} — {v.marque}</option>)}
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold">3 — Inspection</h2>
            <PhotoInspectionGuide onChange={(zone, file) => console.log('file', zone, file)} />
            <div className="mt-4">
              <DamageSelector onAdd={(d) => setDamages(prev => [...prev, d])} />
              <div className="mt-2">Dommages: {damages.length}</div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          {step > 0 && <button className="btn" onClick={() => setStep(s => s - 1)}>Précédent</button>}
          {step < 2 && <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Suivant</button>}
          {step === 2 && <button className="btn btn-primary" onClick={submit}>Terminer et créer BT</button>}
        </div>
      </div>
    </div>
  )
}
