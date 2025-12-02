import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function generatePassword() {
  return crypto.randomBytes(12).toString('hex')
}

export async function POST(req: Request) {
  try {
    const secretHeader = req.headers.get('x-admin-secret')
    const configured = process.env.SUPABASE_ADMIN_SYNC_SECRET
    if (!configured) {
      return NextResponse.json({ error: 'Server misconfigured: set SUPABASE_ADMIN_SYNC_SECRET in .env' }, { status: 500 })
    }
    if (secretHeader !== configured) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({} as any))
    const limit = typeof body.limit === 'number' ? body.limit : 50

    const clientAny = supabaseAdmin as any

    // Fetch a batch of users from public.User
    const { data: users, error: usersErr } = await clientAny.from('User').select('id,email,name,avatarUrl').limit(limit)
    if (usersErr) {
      console.error('[admin/sync-fallback-users] failed to fetch users', usersErr)
      return NextResponse.json({ error: 'Failed to fetch users', details: usersErr }, { status: 500 })
    }

    const results: { created: any[]; skipped: any[]; errors: any[] } = { created: [], skipped: [], errors: [] }

    for (const u of users || []) {
      try {
        const password = await generatePassword()
        const payload: any = {
          id: u.id,
          email: u.email,
          password,
          user_metadata: { name: u.name, avatarUrl: u.avatarUrl },
          email_confirm: true,
        }

        const { data: authUser, error: createErr } = await clientAny.auth.admin.createUser(payload)
        if (createErr) {
          // If email already exists or user exists, mark as skipped
          console.warn('[admin/sync-fallback-users] createUser error for', u.email, createErr.message || createErr)
          results.skipped.push({ id: u.id, email: u.email, reason: createErr.message || createErr })
          continue
        }
        results.created.push({ id: u.id, email: u.email, authUser: authUser?.user ?? authUser })
      } catch (e: any) {
        console.error('[admin/sync-fallback-users] unexpected error for', u.email, e)
        results.errors.push({ id: u.id, email: u.email, error: e?.message || e })
      }
    }

    return NextResponse.json({ ok: true, results })
  } catch (err: any) {
    console.error('[admin/sync-fallback-users] handler error', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
