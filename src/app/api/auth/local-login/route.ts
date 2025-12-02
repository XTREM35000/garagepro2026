import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })

    const clientAny = supabaseAdmin as any
    const { data, error } = await clientAny.from('User').select('id, email, password, name, role, tenantId, avatarUrl').eq('email', email).limit(1)
    if (error) {
      console.error('[api/auth/local-login] DB error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!Array.isArray(data) || data.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const user = data[0]
    const stored = user.password || ''
    const parts = stored.split(':')
    if (parts.length !== 2) return NextResponse.json({ error: 'Invalid password format' }, { status: 500 })

    const salt = parts[0]
    const derived = parts[1]
    try {
      const check = crypto.scryptSync(password, salt, 64).toString('hex')
      if (check !== derived) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    } catch (e: any) {
      console.error('[api/auth/local-login] scrypt error', e)
      return NextResponse.json({ error: 'Authentication failure' }, { status: 500 })
    }

    // Success — return public user object
    const publicUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      avatarUrl: user.avatarUrl,
    }

    return NextResponse.json({ ok: true, user: publicUser })
  } catch (err: any) {
    console.error('[api/auth/local-login] error:', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
