export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import { clients, equipe, pickRandom } from '@/lib/mocks'

function ensureAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    console.error('supabase admin client not configured')
    throw new Error('Supabase admin client not configured')
  }
  return supabaseAdmin
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const tenantId = url.searchParams.get('tenantId') || undefined
  const demo = (url.searchParams.get('demo') || '').toLowerCase() === 'true' || (url.searchParams.get('demo') === '1')
  // Mock photos for demo (include client and takenBy using shared mocks)
  const mockPhotos = [
    { id: 'demo-1', url: '/images/photo1.png', type: 'ENTREE', vehicle: { immatricule: 'ABC-123' }, vehicleId: 'veh-1', client: pickRandom(clients), takenBy: pickRandom(equipe), createdAt: '2025-11-20' },
    { id: 'demo-2', url: '/images/photo2.png', type: 'SORTIE', vehicle: { immatricule: 'DEF-456' }, vehicleId: 'veh-2', client: pickRandom(clients), takenBy: pickRandom(equipe), createdAt: '2025-11-18' },
    { id: 'demo-3', url: '/images/photo3.png', type: 'ENTREE', vehicle: { immatricule: 'GHI-789' }, vehicleId: 'veh-3', client: pickRandom(clients), takenBy: pickRandom(equipe), createdAt: '2025-11-12' },
    { id: 'demo-4', url: '/images/photo4.png', type: 'DEGAT', vehicle: { immatricule: 'JKL-000' }, vehicleId: 'veh-4', client: pickRandom(clients), takenBy: pickRandom(equipe), createdAt: '2025-11-03' },
  ]
  try {
    // If demo requested, return mock data
    if (demo) {
      return NextResponse.json(mockPhotos)
    }

    const client = ensureAdmin()
    // Select vehicle photos with vehicle info (takenBy is optional)
    let query = client.from('VehiclePhoto').select('*, vehicle(*)')
    if (tenantId) query = query.eq('vehicle.tenantId', tenantId)
    const { data, error } = await query
    if (error) {
      console.warn('[api/photos_vehicules] supabase error, falling back to demo mock', error.message)
      return NextResponse.json(mockPhotos)
    }
    // Normalize response into array of objects with expected fields
    const resp: any = data
    const rows = Array.isArray(resp) ? resp : (resp?.data || [])
    const normalized = rows.map((r: any) => ({
      id: r.id,
      url: r.url,
      type: r.type,
      vehicleId: r.vehicleId || r.vehicle?.id,
      vehicle: r.vehicle || null,
      // prefer explicit client/takenBy from row, otherwise pick a sensible mock
      takenBy: r.takenBy || (r.takenById ? { id: r.takenById, name: 'Utilisateur' } : pickRandom(equipe)),
      client: r.client || pickRandom(clients),
      createdAt: r.createdAt || r.created_at || new Date().toISOString(),
    }))

    return NextResponse.json(normalized.length ? normalized : mockPhotos)
  } catch (err: any) {
    console.error('[api/photos_vehicules] error', err)
    // fallback to demo images so UI keeps working in demo mode
    return NextResponse.json(mockPhotos)
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const client = ensureAdmin()
    const { data, error } = await client.from('VehiclePhoto').insert(body).select().limit(1)
    if (error) throw error
    return NextResponse.json((data as any[])[0])
  } catch (err: any) {
    console.error('[api/photos_vehicules POST] error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  try {
    const client = ensureAdmin()
    const { error } = await client.from('VehiclePhoto').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[api/photos_vehicules DELETE] error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
