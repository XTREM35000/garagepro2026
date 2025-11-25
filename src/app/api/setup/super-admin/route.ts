// Next.js App Router - POST
import { NextResponse } from "next/server";
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(password, salt, 64)
  return `${salt}:${derived.toString('hex')}`
}

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      console.error('/api/setup/super-admin: supabase admin client not configured')
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
    }

    const body = await req.json();
    const { firstName, lastName, email, password, avatarUrl } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // find platform tenant (should exist) via Supabase
    const client = supabaseAdmin as any
    const { data: platformRows, error: platformErr } = await client
      .from('Tenant')
      .select('id')
      .eq('isPlatform', true)
      .limit(1)

    if (platformErr) {
      console.error('error querying Tenant', platformErr)
      return NextResponse.json({ error: 'Tenant query failed' }, { status: 500 })
    }

    let tenantId: string | null = null
    if (Array.isArray(platformRows) && platformRows.length > 0) {
      tenantId = (platformRows[0] as any).id
    } else {
      // create platform tenant
      const platformTenantId = crypto.randomUUID()
      const now = new Date().toISOString()
      const { data: createdTenants, error: createErr } = await client
        .from('Tenant')
        .insert({ id: platformTenantId, name: 'PLATFORM', plan: 'platform', isPlatform: true, createdAt: now, updatedAt: now })
        .select('id')
        .limit(1)

      if (createErr) {
        console.error('failed to create platform tenant', createErr)
        return NextResponse.json({ error: 'Failed to create platform tenant' }, { status: 500 })
      }

      tenantId = (createdTenants as any[])[0]?.id ?? null
    }

    if (!tenantId) {
      console.error('Platform tenant not available')
      return NextResponse.json({ error: 'Platform tenant missing' }, { status: 500 })
    }

    // Check existing user
    const { data: existingUsers, error: userErr } = await client
      .from('User')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (userErr) {
      console.error('user lookup failed', userErr)
      return NextResponse.json({ error: 'User lookup failed' }, { status: 500 })
    }

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashed = hashPassword(password)

    // Create user via Supabase with generated UUID
    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    // First create user in auth.users
    const createUserPayload: any = {
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl ?? null
      }
    }

    const { data: authUser, error: authErr } = await client.auth.admin.createUser(createUserPayload)

    if (authErr) {
      console.error('failed to create auth user', authErr)
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 })
    }

    // Then create user in User table with auth user id
    const authUserId = authUser?.user?.id ?? userId
    const { data: createdUsers, error: insertErr } = await client
      .from('User')
      .insert({
        id: authUserId,
        email,
        password: hashed,
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl ?? null,
        role: 'SUPER_ADMIN',
        tenantId,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .limit(1)

    if (insertErr) {
      console.error('failed to create user', insertErr)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    const user = (createdUsers as any[])[0] ?? null

    return NextResponse.json({ ok: true, user }, { status: 201 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
