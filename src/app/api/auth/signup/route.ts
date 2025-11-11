import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, password, avatarUrl } = body

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
    }

    // Create user via Supabase admin (service role) so we can bypass email SMTP for local testing
    const { data, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { first_name: firstName, last_name: lastName, avatar_url: avatarUrl },
      email_confirm: true,
    } as any)

    if (createErr) {
      return NextResponse.json({ error: createErr.message || 'Failed to create user' }, { status: 500 })
    }

    const userId = (data as any)?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'No user id returned from Supabase' }, { status: 500 })
    }

    // Upsert into application User table (Prisma)
    const upsert = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email,
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl ?? null,
      },
      create: {
        id: userId,
        email,
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl ?? null,
        role: 'viewer',
        tenantId: 'demo',
      },
    })

    return NextResponse.json({ ok: true, user: upsert })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
