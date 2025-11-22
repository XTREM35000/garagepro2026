"use client"

import React, { useState } from 'react'

type Tenant = {
  id?: string
  name?: string
  address?: string | null
  rccm?: string | null
  plan?: string | null
}

export default function SettingsForm({ tenant }: { tenant?: Tenant | null }) {
  const [name, setName] = useState(tenant?.name || '')
  const [address, setAddress] = useState(tenant?.address || '')
  const [rccm, setRccm] = useState(tenant?.rccm || '')
  const [plan, setPlan] = useState(tenant?.plan || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMessage(null)
    try {
      const res = await fetch('/api/tenant/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: tenant?.id, name, address, rccm, plan }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur')
      setMessage('Paramètres sauvegardés.')
    } catch (err: any) {
      setMessage(err?.message || String(err))
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom de l&#39;instance</label>
        <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Adresse</label>
        <input value={address || ''} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">RCCM / ID</label>
        <input value={rccm || ''} onChange={e => setRccm(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Plan</label>
        <input value={plan || ''} onChange={e => setPlan(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-md">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        {message && <div className="text-sm text-gray-700">{message}</div>}
      </div>
    </form>
  )
}
