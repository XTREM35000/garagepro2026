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
    let query = supabaseAdmin.from('StockItem').select('*')
    if (tenantId) query = query.eq('tenantId', tenantId)
    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  try {
    ensureAdmin()
    const { data, error } = await supabaseAdmin.from('StockItem').insert(body).select().limit(1)
    if (error) throw error
    return NextResponse.json((data as any[])[0])
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  try {
    ensureAdmin()
    const { data, error } = await supabaseAdmin.from('StockItem').update(body).eq('id', body.id).select().limit(1)
    if (error) throw error
    return NextResponse.json((data as any[])[0])
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  try {
    ensureAdmin()
    const { error } = await supabaseAdmin.from('StockItem').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
