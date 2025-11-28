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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params?.id
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    const client = ensureAdmin()
    // Try to fetch the single photo row (vehicle joined when possible)
    const { data, error } = await client.from('VehiclePhoto').select('*, vehicle(*)').eq('id', id).limit(1)
    if (error) {
      console.warn('[api/photos_vehicules/[id]] supabase error, falling back to mock', error.message)
    }

    const row = Array.isArray(data) && data.length ? data[0] : null

    if (!row) {
      // fallback mock object
      const mock = {
        id: `demo-${id}`,
        url: '/images/photo1.png',
        type: 'ENTREE',
        vehicle: { immatricule: 'ABC-123' },
        vehicleId: 'veh-demo',
        client: pickRandom(clients),
        takenBy: pickRandom(equipe),
        createdAt: new Date().toISOString(),
      }
      return NextResponse.json(mock)
    }

    const normalized = {
      id: row.id,
      url: row.url,
      type: row.type,
      vehicleId: row.vehicleId || row.vehicle?.id,
      vehicle: row.vehicle || null,
      takenBy: row.takenBy || (row.takenById ? { id: row.takenById, name: 'Utilisateur' } : pickRandom(equipe)),
      client: row.client || pickRandom(clients),
      createdAt: row.createdAt || row.created_at || new Date().toISOString(),
    }

    return NextResponse.json(normalized)
  } catch (err: any) {
    console.error('[api/photos_vehicules/[id]] error', err)
    const mock = {
      id: `demo-${params?.id}`,
      url: '/images/photo1.png',
      type: 'ENTREE',
      vehicle: { immatricule: 'ABC-123' },
      vehicleId: 'veh-demo',
      client: pickRandom(clients),
      takenBy: pickRandom(equipe),
      createdAt: new Date().toISOString(),
    }
    return NextResponse.json(mock)
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params?.id
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  try {
    const client = ensureAdmin()
    const { error } = await client.from('VehiclePhoto').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[api/photos_vehicules/[id] DELETE] error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
