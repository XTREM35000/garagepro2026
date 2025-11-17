import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const hasSbAccess = /sb-access-token|sb-refresh-token|supabase-auth-token|__Secure-sso/.test(cookie)
    return NextResponse.json({ ok: true, cookie, hasSbAccess })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
