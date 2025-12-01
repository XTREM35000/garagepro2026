import { NextResponse } from "next/server";
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(password, salt, 64)
  return `${salt}:${derived.toString('hex')}`
}

function ensureAdmin() {
  if (!supabaseAdmin) {
    console.error('supabase admin client not configured')
    throw new Error('Supabase admin client not configured')
  }
  return supabaseAdmin
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, avatarUrl, tenantId } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const client = ensureAdmin();
    const clientAny = client as any;

    // Check tenant: if tenantId provided use it; otherwise find first non-platform tenant
    let tenant = null as any;
    if (tenantId) {
      const { data: tenants, error: tenantErr } = await clientAny
        .from('Tenant')
        .select('id, name, plan')
        .eq('id', tenantId)
        .limit(1);
      if (tenantErr) {
        console.error('error fetching tenant', tenantErr);
        return NextResponse.json({ error: 'Tenant lookup failed' }, { status: 500 });
      }
      tenant = Array.isArray(tenants) && tenants.length > 0 ? (tenants[0] as any) : null;
      if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    } else {
      // fallback: pick first non-platform tenant
      const { data: tenants, error: tenantErr } = await clientAny
        .from('Tenant')
        .select('id, name, plan')
        .eq('isPlatform', false)
        .limit(1);
      if (tenantErr) {
        console.error('error fetching tenant', tenantErr);
        return NextResponse.json({ error: 'Tenant lookup failed' }, { status: 500 });
      }
      tenant = Array.isArray(tenants) && tenants.length > 0 ? (tenants[0] as any) : null;
      if (!tenant) return NextResponse.json({ error: "No tenant available. Create a tenant first." }, { status: 400 });
    }

    // Check if email already exists
    const { data: existingUsers, error: userCheckErr } = await clientAny
      .from('User')
      .select('id')
      .eq('email', email)
      .limit(1);
    if (userCheckErr) {
      console.error('error checking user', userCheckErr);
      return NextResponse.json({ error: 'User lookup failed' }, { status: 500 });
    }
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already used" }, { status: 400 });
    }

    const hashed = hashPassword(password);

    // Create user with generated UUID
    const userId = crypto.randomUUID()
    const signupNow = new Date().toISOString()

    // First create user in auth.users. Control email confirmation via env var
    const bypassConfirm = process.env.SUPABASE_BYPASS_EMAIL_CONFIRM === 'true'
    const createUserPayload: any = {
      email,
      password,
      user_metadata: {
        name: `${firstName || ""} ${lastName || ""}`.trim() || undefined,
        avatarUrl: avatarUrl ?? null
      }
    }
    if (bypassConfirm) createUserPayload.email_confirm = true

    // Try to create user in auth.users, fallback to direct public.User insert on failure
    let authUserId = null as string | null
    let authCreatedSuccessfully = false
    try {
      const { data: authUser, error: authErr } = await clientAny.auth.admin.createUser(createUserPayload)
      if (authErr) {
        console.error('failed to create auth user', authErr)
      } else {
        authUserId = authUser?.user?.id ?? null
        if (authUserId) authCreatedSuccessfully = true
      }
    } catch (e: any) {
      console.error('exception creating auth user', e)
    }

    // If no auth id, generate one for public.User
    if (!authUserId) authUserId = userId

    // Then create user in User table with auth user id (role lowercase)
    const { data: createdUsers, error: createUserErr } = await (clientAny.from('User') as any)
      .insert({
        id: authUserId,
        email,
        password: hashed,
        name: `${firstName || ""} ${lastName || ""}`.trim() || undefined,
        avatarUrl: avatarUrl ?? null,
        role: 'viewer',
        tenantId: tenant.id,
        createdAt: signupNow,
        updatedAt: signupNow
      })
      .select('id, email, name, role, tenantId, avatarUrl')
      .limit(1);

    if (createUserErr) {
      console.error('failed to create user', createUserErr);
      // If we created auth user but failed to sync, attempt rollback
      try {
        if (authCreatedSuccessfully && authUserId) await clientAny.auth.admin.deleteUser(authUserId)
      } catch (delErr) {
        console.error('failed to rollback auth user after sync failure', delErr)
      }
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    const user = (createdUsers as any[])[0];
    const publicUser = { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId, avatarUrl: user.avatarUrl };

    // Return session data for automatic login (since email_confirm bypasses the email confirmation requirement)
    return NextResponse.json({
      ok: true,
      user: publicUser,
      autoLogin: true,
      authCreated: authCreatedSuccessfully,
      fallback: !authCreatedSuccessfully
    }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
