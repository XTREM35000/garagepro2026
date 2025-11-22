export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const role = url.searchParams.get('role')
  const where = role ? { role: role as any } : {}
  const users = await prisma.user.findMany({ where })
  return NextResponse.json(users)
}

export async function PUT(req: Request) {
  const body = await req.json()
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const updated = await prisma.user.update({ where: { id: body.id }, data: body })
  return NextResponse.json(updated)
}

export async function POST(req: Request) {
  const body = await req.json()
  const created = await prisma.user.create({ data: body })
  return NextResponse.json(created)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
