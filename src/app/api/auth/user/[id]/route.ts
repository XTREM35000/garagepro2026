export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

function ensureAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    console.error('supabase admin client not configured')
    throw new Error('Supabase admin client not configured')
  }
  return supabaseAdmin
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const client = ensureAdmin()
    const { data: rows, error } = await client
      .from('User')
      .select('id, name, avatarUrl, role, tenantId')
      .eq('id', id)
      .limit(1)

    if (error) throw error
    const user = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(user, { status: 200 })
  } catch (err: any) {
    console.error('[api/auth/user] error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

    const body = await req.json()
    const { firstName, lastName, avatarUrl } = body || {}

    const name = [firstName, lastName].filter(Boolean).join(' ') || undefined

    const data: any = {}
    if (name !== undefined) data.name = name
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No update fields provided' }, { status: 400 })
    }

    const client = ensureAdmin()
    const { data: updatedRows, error } = await client
      .from('User')
      .update(data)
      .eq('id', id)
      .select('id, name, avatarUrl, role, tenantId')
      .limit(1)

    if (error) throw error
    const updated = Array.isArray(updatedRows) && updatedRows.length > 0 ? (updatedRows[0] as any) : null
    return NextResponse.json(updated, { status: 200 })
  } catch (err: any) {
    console.error('[api/auth/user PATCH] error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
