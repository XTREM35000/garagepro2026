export const runtime = "nodejs";

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    console.log('[api/auth/signup/debug] POST received - timestamp:', new Date().toISOString())
    // try to read headers safely
    try {
      console.log('[api/auth/signup/debug] headers:', Object.fromEntries((req as any).headers || []))
    } catch (hdrErr) {
      console.warn('[api/auth/signup/debug] could not read headers:', hdrErr)
    }

    let body: any
    try {
      body = await req.json()
    } catch (err) {
      console.error('[api/auth/signup/debug] Failed to parse JSON body:', err)
      return NextResponse.json({ ok: false, error: 'Invalid JSON body', rawError: String(err) }, { status: 400 })
    }

    console.log('[api/auth/signup/debug] body:', body)

    return NextResponse.json({ ok: true, headers: Object.fromEntries((req as any).headers || []), body }, { status: 200 })
  } catch (err: any) {
    console.error('[api/auth/signup/debug] exception:', err)
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 })
  }
}
