export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const tenantId = url.searchParams.get('id') || req.headers.get('x-tenant-id') || undefined

  if (!tenantId) return NextResponse.json({ error: 'missing tenant id (use ?id= or x-tenant-id)' }, { status: 400 })
  if (!supabaseAdmin) return NextResponse.json({ error: 'supabase admin client not configured' }, { status: 500 })

  try {
    // counts
    const vehicleCountResp = await supabaseAdmin.from('Vehicle').select('*', { count: 'exact', head: true }).eq('tenantId', tenantId)
    const usersCountResp = await supabaseAdmin.from('User').select('*', { count: 'exact', head: true }).eq('tenantId', tenantId)
    const photosCountResp = await supabaseAdmin.from('VehiclePhoto').select('*', { count: 'exact', head: true }).eq('vehicleId', tenantId) // note: demo: maybe should be tenantId

    // recent rows
    const recentVehicles = await supabaseAdmin.from('Vehicle').select('*').eq('tenantId', tenantId).order('createdAt', { ascending: false }).limit(5)
    const recentUsers = await supabaseAdmin.from('User').select('*').eq('tenantId', tenantId).order('createdAt', { ascending: false }).limit(5)
    const recentPhotos = await supabaseAdmin.from('VehiclePhoto').select('*').order('createdAt', { ascending: false }).limit(5).eq('vehicleId', tenantId)

    return NextResponse.json({
      counts: {
        vehicles: vehicleCountResp.count ?? 0,
        users: usersCountResp.count ?? 0,
        photos: photosCountResp.count ?? 0,
      },
      recent: {
        vehicles: recentVehicles.data ?? [],
        users: recentUsers.data ?? [],
        photos: recentPhotos.data ?? [],
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 })
  }
}
