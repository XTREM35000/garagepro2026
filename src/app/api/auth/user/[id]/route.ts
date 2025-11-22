export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        tenantId: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

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

    const updated = await prisma.user.update({ where: { id }, data, select: { id: true, name: true, avatarUrl: true, role: true, tenantId: true } })

    return NextResponse.json(updated, { status: 200 })
  } catch (err: any) {
    console.error('[api/auth/user PATCH] error:', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
