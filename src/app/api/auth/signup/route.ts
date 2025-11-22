export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@prisma/client'

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

    // Ensure we have a tenant BEFORE creating the user (so the trigger can reference it if needed)
    console.log('[api/auth/signup] ensuring tenant exists before createUser...')
    let tenantIdToUse: string | null = null
    try {
      const existingTenant = await prisma.tenant.findFirst()
      if (existingTenant) {
        tenantIdToUse = existingTenant.id
        console.log('[api/auth/signup] using existing tenant id:', tenantIdToUse)
      } else {
        // Utiliser le nom complet du nouvel utilisateur comme nom du tenant
        const fullName = `${firstName} ${lastName}`
        const createdTenant = await prisma.tenant.create({ data: { name: fullName } })
        tenantIdToUse = createdTenant.id
        console.log('[api/auth/signup] created tenant with real name:', tenantIdToUse, fullName)
      }
    } catch (tenantErr) {
      console.error('[api/auth/signup] error ensuring tenant exists:', tenantErr)
      return NextResponse.json({ error: 'Database error creating tenant' }, { status: 500 })
    }

    // Assign role according to rules:
    // - 1st user in the entire DB -> super_admin
    // - Otherwise: if this tenant has no users yet -> admin (tenant admin)
    const totalUsers = await prisma.user.count()
    let roleForNewUser: UserRole
    if (totalUsers === 0) {
      roleForNewUser = 'super_admin' as UserRole
      console.log('[api/auth/signup] totalUsers=0 -> assigning role super_admin')
    } else {
      // count users for this tenant
      const tenantUsers = await prisma.user.count({ where: { tenantId: tenantIdToUse } })
      if (tenantUsers === 0) {
        roleForNewUser = 'admin' as UserRole
        console.log('[api/auth/signup] tenant has no users -> assigning role admin for tenant:', tenantIdToUse)
      } else {
        roleForNewUser = 'viewer' as UserRole
        console.log('[api/auth/signup] tenant has users -> assigning role viewer for tenant:', tenantIdToUse)
      }
    }

    // Désactiver le trigger pour éviter les conflits, puis créer l'utilisateur
    console.log('[api/auth/signup] disabling trigger on_auth_user_created...')
    try {
      await prisma.$executeRawUnsafe('ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created')
    } catch (disErr) {
      console.warn('[api/auth/signup] could not disable trigger (may not exist yet):', disErr)
    }

    // Créer l'utilisateur via Supabase admin (service role)
    let createResp: any
    try {
      createResp = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { first_name: firstName, last_name: lastName, avatar_url: avatarUrl, tenant_id: tenantIdToUse },
        email_confirm: true,
      } as any)
      console.log('[api/auth/signup] supabase createUser full response:', createResp)
    } catch (createEx) {
      console.error('[api/auth/signup] supabase.createUser threw exception:', createEx)
      if (createEx && (createEx as any).response) console.error('[api/auth/signup] supabase exception response:', (createEx as any).response)
      return NextResponse.json({ error: (createEx as any)?.message || String(createEx) }, { status: 500 })
    } finally {
      // Réactiver le trigger
      console.log('[api/auth/signup] re-enabling trigger on_auth_user_created...')
      try {
        await prisma.$executeRawUnsafe('ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created')
      } catch (enableErr) {
        console.warn('[api/auth/signup] could not re-enable trigger:', enableErr)
      }
    }

    const { data, error: createErr } = createResp ?? {}
    console.log('[api/auth/signup] supabase createUser response error:', createErr)
    console.log('[api/auth/signup] supabase createUser response data:', data)

    if (createErr) {
      console.error('[api/auth/signup] createUser error:', createErr)
      const supaMsg = (createErr && (createErr as any).message) || JSON.stringify(createErr)
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({ error: supaMsg, debug: createResp }, { status: 500 })
      }
      return NextResponse.json({ error: supaMsg }, { status: 500 })
    }

    const userId = (data as any)?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'No user id returned from Supabase' }, { status: 500 })
    }

    // Manuellement créer/upserter l'utilisateur dans Prisma
    console.log('[api/auth/signup] manually upserting user into Prisma with id:', userId)
    let upsert
    try {
      upsert = await prisma.user.upsert({
        where: { id: userId },
        update: {
          name: `${firstName} ${lastName}`,
          avatarUrl: avatarUrl ?? null,
        },
        create: {
          id: userId,
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
    console.log('[api/auth/signup] prisma upsert result (sanitized):', { id: upsert?.id, name: upsert?.name })

    const duration = Date.now() - start
    console.log('[api/auth/signup] completed successfully in', duration, 'ms')

    return NextResponse.json({ ok: true, user: upsert }, { status: 201 })
  } catch (err: any) {
    console.error('[api/auth/signup] exception:', err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
