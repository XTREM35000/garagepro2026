"use client"
import React, { useEffect, useState } from 'react'

type Props = { tenantId: string, role: string }

export default function DashboardOverview({ tenantId, role }: Props) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<any | null>(null)

  useEffect(() => {
    if (!tenantId) return
    setLoading(true); setError(null)
    fetch(`/api/dashboard/overview?id=${encodeURIComponent(tenantId)}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) setError(json.error)
        else setData(json)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [tenantId])

  useEffect(() => {
    if (!tenantId) return
    fetch(`/api/dashboard/metrics?id=${encodeURIComponent(tenantId)}`)
      .then(res => res.json())
      .then(json => { if (!json.error) setMetrics(json) })
      .catch(() => { })
  }, [tenantId])

  if (loading) return <div>Chargement...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!data) return <div className="text-gray-500">Aucune donnée</div>

  const counts = data.counts || {}

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Véhicules</div>
          <div className="text-2xl font-bold">{counts.vehicles ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Utilisateurs</div>
          <div className="text-2xl font-bold">{counts.users ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Photos</div>
          <div className="text-2xl font-bold">{counts.photos ?? 0}</div>
        </div>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-2">Récents véhicules</h3>
        {data.recent?.vehicles?.length ? (
          <ul className="space-y-2">
            {data.recent.vehicles.map((v: any) => (
              <li key={v.id} className="text-sm">{v.marque} {v.modele} — {v.immatricule}</li>
            ))}
          </ul>
        ) : <div className="text-sm text-gray-500">Aucun véhicule récent</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Récents utilisateurs</h3>
          {data.recent?.users?.length ? (
            <ul className="space-y-2">
              {data.recent.users.map((u: any) => (<li key={u.id} className="text-sm">{u.email} — {u.name}</li>))}
            </ul>
          ) : <div className="text-sm text-gray-500">Aucun utilisateur récent</div>}
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Récents photos</h3>
          {data.recent?.photos?.length ? (
            <ul className="space-y-2">
              {data.recent.photos.map((p: any) => (<li key={p.id} className="text-sm">{p.url}</li>))}
            </ul>
          ) : <div className="text-sm text-gray-500">Aucune photo récente</div>}
        </div>
      </div>

      {/* display metrics sparklines for admins */}
      {(role === 'super_admin' || role === 'admin') && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <div className="text-xs text-gray-500">Véhicules (7j)</div>
            <div className="mt-2"><Sparkline data={metrics.vehicles || []} /></div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="text-xs text-gray-500">Utilisateurs (7j)</div>
            <div className="mt-2"><Sparkline data={metrics.users || []} /></div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="text-xs text-gray-500">Photos (7j)</div>
            <div className="mt-2"><Sparkline data={metrics.photos || []} /></div>
          </div>
        </div>
      )}
    </div>
  )
}

function Sparkline({ data }: { data: Array<{ day: string, cnt: number }> }) {
  // Prepare values array of length 7 (fill zeros if missing)
  const vals = (data || []).map(d => Number(d.cnt))
  const max = Math.max(1, ...vals)
  const points = vals.map((v, i) => `${(i / (Math.max(1, vals.length - 1))) * 100},${100 - (v / max) * 100}`)
  const poly = points.join(' ')
  return (
    <svg viewBox="0 0 100 100" className="w-full h-16">
      <polyline fill="none" stroke="#0ea5e9" strokeWidth={2} points={poly} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
