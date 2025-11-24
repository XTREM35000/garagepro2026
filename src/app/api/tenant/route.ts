export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getBearerToken, verifyUserAndRole } from '@/lib/auth-server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id') || req.headers.get('x-tenant-id') || undefined

  if (!id) return NextResponse.json({ error: 'missing tenant id (use ?id= or x-tenant-id)' }, { status: 400 })
  if (!supabaseAdmin) return NextResponse.json({ error: 'supabase admin client not configured' }, { status: 500 })

  // For GET, allow any authenticated user to read tenant info (optional: could restrict to tenant members)
  const token = getBearerToken(req)
  if (!token) {
    // Fallback: allow unauthenticated read for demo (remove in production)
    const { data, error } = await supabaseAdmin.from('Tenant').select('*').eq('id', id).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? null)
  }

  try {
    const user = await verifyUserAndRole(token)
    if (user.tenantId !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin.from('Tenant').select('*').eq('id', id).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? null)
}

export async function PUT(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'supabase admin client not configured' }, { status: 500 })

  // Verify user has authorization (super_admin or owner)
  const token = getBearerToken(req)
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let user
  try {
    user = await verifyUserAndRole(token, 'SUPER_ADMIN')
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 })
  }

  const body = await req.json()
  const id = body.id || new URL(req.url).searchParams.get('id') || req.headers.get('x-tenant-id')
  if (!id) return NextResponse.json({ error: 'missing tenant id' }, { status: 400 })

  // Verify user's tenant matches requested tenant
  if (user.tenantId !== id) return NextResponse.json({ error: 'Forbidden: cannot edit other tenant' }, { status: 403 })

  const updates: Record<string, unknown> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.address !== undefined) updates.address = body.address
  if (body.logoUrl !== undefined) updates.logoUrl = body.logoUrl
  if (body.plan !== undefined) updates.plan = body.plan
  if (body.rccm !== undefined) updates.rccm = body.rccm

  // supabaseAdmin checked above; assert non-null and cast updates to any for the typed client
  const { data, error } = await (supabaseAdmin as any).from('Tenant').update(updates).eq('id', id).select().maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? null)
}
