import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const start = Date.now()
    console.log('[api/auth/signup] POST received - timestamp:', new Date().toISOString())

    // log headers (helpful when running behind proxies / Vercel)
    try {
      console.log('[api/auth/signup] headers:', Object.fromEntries((req as any).headers || []))
    } catch (hdrErr) {
      console.warn('[api/auth/signup] could not read headers:', hdrErr)
    }

    // log presence of key env vars (do not print secrets)
    console.log('[api/auth/signup] ENV: SUPABASE_SERVICE_ROLE_KEY present=', !!process.env.SUPABASE_SERVICE_ROLE_KEY, 'NEXT_PUBLIC_SUPABASE_URL=', !!process.env.NEXT_PUBLIC_SUPABASE_URL, 'DATABASE_URL=', !!process.env.DATABASE_URL)

    let body: any
    try {
      body = await req.json()
    } catch (parseErr) {
      console.error('[api/auth/signup] Failed to parse JSON body:', parseErr)
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    console.log('[api/auth/signup] body:', body)
    const { firstName, lastName, email, password, avatarUrl } = body ?? {}

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      console.warn('[api/auth/signup] missing required fields', { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName })
      return NextResponse.json({ error: 'Missing required fields: firstName, lastName, email, password' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      console.error('[api/auth/signup] Supabase admin client not configured (SUPABASE_SERVICE_ROLE_KEY missing)')
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
    }

    // Create user via Supabase admin (service role) so we can bypass email SMTP for local testing
    let createResp: any
    try {
      createResp = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { first_name: firstName, last_name: lastName, avatar_url: avatarUrl },
        email_confirm: true,
      } as any)
      console.log('[api/auth/signup] supabase createUser full response:', createResp)
    } catch (createEx) {
      console.error('[api/auth/signup] supabase.createUser threw exception:', createEx)
      if (createEx && (createEx as any).response) console.error('[api/auth/signup] supabase exception response:', (createEx as any).response)
      return NextResponse.json({ error: (createEx as any)?.message || String(createEx) }, { status: 500 })
    }

    const { data, error: createErr } = createResp ?? {}
    console.log('[api/auth/signup] supabase createUser response error:', createErr)
    console.log('[api/auth/signup] supabase createUser response data:', data)

    if (createErr) {
      console.error('[api/auth/signup] createUser error:', createErr)
      const supaMsg = (createErr && (createErr as any).message) || JSON.stringify(createErr)
      // In development, return the full Supabase response to aid debugging (do not expose in production)
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ error: supaMsg, debug: createResp }, { status: 500 })
      }
      return NextResponse.json({ error: supaMsg }, { status: 500 })
    }

    const userId = (data as any)?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'No user id returned from Supabase' }, { status: 500 })
    }
    // Ensure we have a tenant to attach the user to. Using a missing tenantId causes FK errors.
    console.log('[api/auth/signup] upserting user into Prisma with id:', userId)
    let tenantIdToUse: string | null = null
    try {
      const existingTenant = await prisma.tenant.findFirst()
      if (existingTenant) {
        tenantIdToUse = existingTenant.id
        console.log('[api/auth/signup] using existing tenant id:', tenantIdToUse)
      } else {
        const createdTenant = await prisma.tenant.create({ data: { name: 'Demo Tenant' } })
        tenantIdToUse = createdTenant.id
        console.log('[api/auth/signup] created demo tenant id:', tenantIdToUse)
      }
    } catch (tenantErr) {
      console.error('[api/auth/signup] error ensuring tenant exists:', tenantErr)
      return NextResponse.json({ error: 'Database error creating tenant' }, { status: 500 })
    }

    // Check if an application user already exists with this email but a different id.
    try {
      const existingByEmail = await prisma.user.findUnique({ where: { email } })
      if (existingByEmail && existingByEmail.id !== userId) {
        console.error('[api/auth/signup] conflict: existing app user with same email but different id', { existingId: existingByEmail.id, supabaseId: userId })
        return NextResponse.json({ error: 'An application user with this email already exists. Please sign in instead.' }, { status: 409 })
      }
    } catch (checkErr) {
      console.error('[api/auth/signup] error checking existing user by email:', checkErr)
      // continue to attempt upsert; this error is non-fatal for the main flow
    }
    // Check if this is the first user (they should be super_admin)
    const userCount = await prisma.user.count()
    const roleForNewUser = userCount === 0 ? 'super_admin' : 'viewer'
    console.log('[api/auth/signup] userCount:', userCount, 'assigning role:', roleForNewUser)

    let upsert
    try {
      upsert = await prisma.user.upsert({
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
          role: roleForNewUser,
          tenantId: tenantIdToUse as string,
        },
      })
    } catch (prismaErr: unknown) {
      console.error('[api/auth/signup] Prisma upsert error:', prismaErr)
      if (prismaErr && (prismaErr as any).stack) console.error('[api/auth/signup] Prisma stack:', (prismaErr as any).stack)
      const message = prismaErr instanceof Error ? prismaErr.message : String(prismaErr)
      return NextResponse.json({ error: message }, { status: 500 })
    }

    // Log sanitized user for debug (avoid printing secrets)
    console.log('[api/auth/signup] prisma upsert result (sanitized):', { id: upsert?.id, email: upsert?.email, name: upsert?.name })

    const duration = Date.now() - start
    console.log('[api/auth/signup] completed successfully in', duration, 'ms')

    return NextResponse.json({ ok: true, user: upsert }, { status: 201 })
  } catch (err: any) {
    console.error('[api/auth/signup] exception:', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
