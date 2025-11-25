export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id
    if (!supabaseAdmin) {
      console.error('[api/tenant/settings] supabase admin client not configured')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const { data: userRows, error: userErr } = await supabaseAdmin
      .from('User')
      .select('role')
      .eq('id', userId)
      .limit(1)

    if (userErr) {
      console.error('[api/tenant/settings] user lookup failed', userErr)
      return NextResponse.json({ error: 'User lookup failed' }, { status: 500 })
    }

    const user = Array.isArray(userRows) && userRows.length > 0 ? (userRows[0] as any) : null
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!(user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { tenantId, name, address, rccm, plan } = body
    if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

    const { data: updatedTenants, error: updateErr } = await supabaseAdmin
      .from('Tenant')
      .update({ name, address, rccm, plan })
      .eq('id', tenantId)
      .select()
      .limit(1)

    if (updateErr) {
      console.error('[api/tenant/settings] tenant update failed', updateErr)
      return NextResponse.json({ error: 'Failed to update tenant' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, tenant: (updatedTenants as any[])[0] })
  } catch (err: any) {
    console.error('[api/tenant/settings] error', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
