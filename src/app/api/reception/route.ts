import { NextResponse } from 'next/server'
import { mockReceptions, createReception } from '@/lib/mocks_reception'

export async function GET() {
  return NextResponse.json(mockReceptions)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // If client sends full reception object, push into mocks
    const rec = createReception(body)
    return NextResponse.json(rec, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
