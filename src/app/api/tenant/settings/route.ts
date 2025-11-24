export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (!(user.role === UserRole.TENANT_ADMIN || user.role === UserRole.SUPER_ADMIN)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { tenantId, name, address, rccm, plan } = body
    if (!tenantId) return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })

    const updated = await prisma.tenant.update({ where: { id: tenantId }, data: { name, address, rccm, plan } })
    return NextResponse.json({ ok: true, tenant: updated })
  } catch (err: any) {
    console.error('[api/tenant/settings] error', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
