import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

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

    // Support both bcrypt and scrypt-style stored passwords
    let verified = false
    try {
      if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
        // bcrypt hashed (super-admin route uses bcrypt)
        verified = await bcrypt.compare(password, stored)
      } else if (stored.includes(':')) {
        // scrypt style: salt:derived_hex
        const parts = stored.split(':')
        if (parts.length === 2) {
          const salt = parts[0]
          const derived = parts[1]
          const check = crypto.scryptSync(password, salt, 64).toString('hex')
          verified = check === derived
        }
      } else {
        console.warn('[api/auth/local-login] Unknown password hash format for user', user.id)
      }
    } catch (e: any) {
      console.error('[api/auth/local-login] password verification error', e)
      return NextResponse.json({ error: 'Authentication failure' }, { status: 500 })
    }

    if (!verified) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    // Success — return public user object
    const publicUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      avatarUrl: user.avatarUrl,
    }

    // Create a signed fallback cookie so server-side middleware can allow access
    try {
      const secret = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      if (secret) {
        const now = Math.floor(Date.now() / 1000)
        const payload = { id: user.id, role: user.role, iat: now, exp: now + 60 * 60 * 24 } // 24h
        const payloadStr = JSON.stringify(payload)
        const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('hex')
        const cookieVal = Buffer.from(payloadStr).toString('base64') + '.' + signature
        const isSecure = process.env.NODE_ENV === 'production'
        const cookie = `saas_local_auth=${cookieVal}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}${isSecure ? '; Secure' : ''}`
        const res = NextResponse.json({ ok: true, user: publicUser })
        res.headers.set('Set-Cookie', cookie)
        return res
      }
    } catch (e: any) {
      console.warn('[api/auth/local-login] failed to set fallback cookie', e)
    }

    return NextResponse.json({ ok: true, user: publicUser })
  } catch (err: any) {
    console.error('[api/auth/local-login] error:', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
