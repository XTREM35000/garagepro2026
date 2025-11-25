"use client"
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TenantSettings() {
  const [tenantId, setTenantId] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Fetch access token on mount
  useEffect(() => {
    const getToken = async () => {
      const { data, error } = await supabase!.auth.getSession()
      if (data?.session?.access_token) {
        setToken(data.session.access_token)
        // Pre-fill tenantId from user profile if available
        const { data: userData } = await supabase!.auth.getUser()
        if (userData?.user?.id) {
          // Optionally fetch user profile to get tenantId
        }
      } else if (error) {
        setError(`Auth error: ${error.message}`)
      }
    }
    getToken()
  }, [])

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const headers: HeadersInit = { 'content-type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch(`/api/tenant?id=${encodeURIComponent(tenantId)}`, { headers })
      if (!res.ok) throw new Error(`Erreur: ${res.status}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (e: any) {
      setError(String(e.message || e))
    } finally { setLoading(false) }
  }

  async function save() {
    if (!data?.id) return setError('Aucun tenant chargé')
    if (!token) return setError('Non authentifié')
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/tenant', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error(`Erreur: ${res.status}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
      alert('Sauvegardé')
    } catch (e: any) { setError(String(e.message || e)) } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      {token ? (
        <div className="text-sm text-green-600">✓ Authentifié</div>
      ) : (
        <div className="text-sm text-gray-500">Non authentifié (démonstration limitée)</div>
      )}

      <div className="flex gap-2">
        <input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="Tenant id (ex: demo)" className="border p-2 flex-1" />
        <button onClick={load} className="btn btn-primary" disabled={loading || !tenantId}>Charger</button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {data && (
        <div className="p-4 bg-white rounded shadow">
          <label className="block mb-2">Nom
            <input className="w-full border p-2 mt-1" value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </label>
          <label className="block mb-2">Adresse
            <input className="w-full border p-2 mt-1" value={data.address || ''} onChange={(e) => setData({ ...data, address: e.target.value })} />
          </label>
          <label className="block mb-2">Logo URL
            <input className="w-full border p-2 mt-1" value={data.logoUrl || ''} onChange={(e) => setData({ ...data, logoUrl: e.target.value })} />
          </label>
          <label className="block mb-2">Plan
            <input className="w-full border p-2 mt-1" value={data.plan || ''} onChange={(e) => setData({ ...data, plan: e.target.value })} />
          </label>

          <div className="mt-4">
            <button onClick={save} className="btn btn-primary" disabled={loading || !token}>Sauvegarder</button>
          </div>
        </div>
      )}
    </div>
  )
}
