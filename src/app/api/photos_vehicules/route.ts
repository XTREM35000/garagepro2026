export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const tenantId = url.searchParams.get('tenantId') || undefined
  const photos = await prisma.vehiclePhoto.findMany({ where: tenantId ? { vehicle: { tenantId } } : {}, include: { takenBy: true, vehicle: true } })
  return NextResponse.json(photos)
}

export async function POST(req: Request) {
  const body = await req.json()
  const created = await prisma.vehiclePhoto.create({ data: body })
  return NextResponse.json(created)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.vehiclePhoto.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
