import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function parseTenantId(req: Request) {
  const url = new URL(req.url)
  return url.searchParams.get('id') || req.headers.get('x-tenant-id') || undefined
}

async function seriesFor(table: string, tenantId: string, dateCol = 'createdAt') {
  // Simple reliable approach: fetch rows for last 7 days and aggregate client-side.
  const admin = supabaseAdmin!
  const since = new Date()
  since.setDate(since.getDate() - 7)
  const isoSince = since.toISOString()

  const { data, error } = await admin.from(table).select(`${dateCol}`).eq('tenantId', tenantId).gte(dateCol, isoSince).order(dateCol, { ascending: true })
  if (error || !data) return []

  // aggregate by day
  const map = new Map<string, number>()
  for (const row of data as any[]) {
    const d = new Date(row[dateCol])
    const key = d.toISOString().slice(0, 10)
    map.set(key, (map.get(key) || 0) + 1)
  }

  // build array for last 7 days in ascending order
  const out: Array<{ day: string, cnt: number }> = []
  for (let i = 7; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    out.push({ day: key, cnt: map.get(key) || 0 })
  }
  return out
}

export async function GET(req: Request) {
  const tenantId = parseTenantId(req)
  if (!tenantId) return NextResponse.json({ error: 'missing tenant id (use ?id= or x-tenant-id)' }, { status: 400 })
  if (!supabaseAdmin) return NextResponse.json({ error: 'supabase admin client not configured' }, { status: 500 })

  try {
    // Attempt simple counts per day for last 7 days
    const vehicles = await seriesFor('Vehicle', tenantId, 'createdAt')
    const users = await seriesFor('User', tenantId, 'createdAt')
    const photos = await seriesFor('VehiclePhoto', tenantId, 'createdAt')

    return NextResponse.json({ vehicles, users, photos })
  } catch (e: any) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 })
  }
}
