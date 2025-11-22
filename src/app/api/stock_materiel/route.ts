export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const tenantId = url.searchParams.get('tenantId') || undefined
  const items = await prisma.stockItem.findMany({ where: tenantId ? { tenantId } : {} })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const body = await req.json()
  const created = await prisma.stockItem.create({ data: body })
  return NextResponse.json(created)
}

export async function PUT(req: Request) {
  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const updated = await prisma.stockItem.update({ where: { id: body.id }, data: body })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.stockItem.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
