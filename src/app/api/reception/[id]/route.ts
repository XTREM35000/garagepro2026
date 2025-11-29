import { NextResponse } from 'next/server'
import { mockReceptions, deleteReception } from '@/lib/mocks_reception'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const rec = mockReceptions.find(r => r.id === id)
  if (!rec) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(rec)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  deleteReception(id)
  return NextResponse.json({ ok: true })
}
