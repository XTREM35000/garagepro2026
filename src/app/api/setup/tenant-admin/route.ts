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
    const { tenantName, firstName, lastName, email, password, avatarUrl } = body;

    if (!tenantName || !firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = ensureAdmin();
    const clientAny = client as any;

    // Check for duplicate tenant name
    const { data: existingTenants, error: existErr } = await clientAny
      .from('Tenant')
      .select('id')
      .eq('name', tenantName)
      .limit(1);

    if (existErr) {
      console.error('error checking tenant', existErr);
      return NextResponse.json({ error: 'Tenant lookup failed' }, { status: 500 });
    }

    if (Array.isArray(existingTenants) && existingTenants.length > 0) {
      return NextResponse.json({ error: "Tenant already exists" }, { status: 400 });
    }

    // Create tenant
    const tenantId = crypto.randomUUID()
    const now = new Date().toISOString()
    const { data: createdTenants, error: createTenantErr } = await clientAny
      .from('Tenant')
      .insert({ id: tenantId, name: tenantName, plan: 'basic', createdAt: now, updatedAt: now })
      .select('id, name, plan')
      .limit(1);

    if (createTenantErr) {
      console.error('failed to create tenant', createTenantErr);
      return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
    }

    const tenant = (createdTenants as any[])[0];
    if (!tenant?.id) {
      return NextResponse.json({ error: 'Tenant creation failed' }, { status: 500 });
    }

    const hashed = hashPassword(password);

    // Create user with generated UUID
    const userId = crypto.randomUUID()
    const userNow = new Date().toISOString()

    // First create user in auth.users
    // First create user in auth.users. Control email confirmation via env var
    const bypassConfirm = process.env.SUPABASE_BYPASS_EMAIL_CONFIRM === 'true'
    const createUserPayload: any = {
      email,
      password,
      user_metadata: {
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl ?? null
      }
    }
    if (bypassConfirm) createUserPayload.email_confirm = true

    const { data: authUser, error: authErr } = await clientAny.auth.admin.createUser(createUserPayload)

    if (authErr) {
      console.error('failed to create auth user', authErr)
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 500 })
    }

    // Then create user in User table with auth user id
    const authUserId = authUser?.user?.id ?? userId
    const { data: createdUsers, error: createUserErr } = await clientAny
      .from('User')
      .insert({
        id: authUserId,
        email,
        password: hashed,
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl ?? null,
        role: 'TENANT_ADMIN',
        tenantId: tenant.id,
        createdAt: userNow,
        updatedAt: userNow
      })
      .select('id, email, name, role, tenantId')
      .limit(1);

    if (createUserErr) {
      console.error('failed to create user', createUserErr);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    const user = (createdUsers as any[])[0];

    return NextResponse.json({ ok: true, tenant, admin: user }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
