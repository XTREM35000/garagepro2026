export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function ensureAdmin() {
  if (!supabaseAdmin) {
    console.error('supabase admin client not configured')
    throw new Error('Supabase admin client not configured')
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const tenantId = url.searchParams.get('tenantId') || undefined
  try {
    ensureAdmin()
    // Select vehicle photos and include related takenBy and vehicle
    let query = supabaseAdmin.from('VehiclePhoto').select('*, takenBy(*), vehicle(*)')
    if (tenantId) query = query.eq('vehicle.tenantId', tenantId)
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[api/photos_vehicules] error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  try {
    ensureAdmin()
    const { data, error } = await supabaseAdmin.from('VehiclePhoto').insert(body).select().limit(1)
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
    ensureAdmin()
    const { error } = await supabaseAdmin.from('VehiclePhoto').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[api/photos_vehicules DELETE] error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
