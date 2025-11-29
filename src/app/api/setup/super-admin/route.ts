// src/app/api/setup/super-admin/route.ts
import { NextResponse } from "next/server";
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derived.toString('hex')}`;
}

export async function POST(req: Request) {
  try {
    // 🔧 DEBUG - Variables d'environnement
    console.log('🔧 DEBUG - Variables env:');
    console.log('SUPABASE_URL présent:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SERVICE_ROLE_KEY présent:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...');

    if (!supabaseAdmin) {
      console.error('/api/setup/super-admin: supabase admin client not configured');
      return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
    }

    const body = await req.json();
    const { firstName, lastName, email, password, avatarUrl } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log('🎯 Création Super Admin (avec auth)');

    const client = supabaseAdmin as any;

    // Check existing user in public.User
    const { data: existingUsers, error: userErr } = await client
      .from('User')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (userErr) {
      console.error('user lookup failed', userErr);
      return NextResponse.json({ error: 'User lookup failed' }, { status: 500 });
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashed = hashPassword(password);
    const now = new Date().toISOString();

    // 🔍 ÉTAPE 1: Tentative création Auth avec fallback
    console.log('🔐 Tentative création auth.users...');

    let authUserId: string | null = null;
    let authCreatedSuccessfully = false;

    const authResponse = await client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl ?? null,
      }
    });

    try {
      console.log('📨 Réponse auth COMPLÈTE:', JSON.stringify(authResponse, null, 2));
    } catch (_) {
      console.log('📨 Réponse auth (non sérialisable):', authResponse);
    }

    const { data: authUser, error: authErr } = authResponse as any;

    if (authErr) {
      try {
        console.error('❌ ERREUR AUTH DÉTAILLÉE:', JSON.stringify(authErr, Object.getOwnPropertyNames(authErr), 2));
      } catch (_) {
        console.error('❌ ERREUR AUTH DÉTAILLÉE (non sérialisable):', authErr);
      }
      console.warn('⚠️ Auth creation failed, fallback to public.User insert');
    } else {
      authUserId = (authUser as any)?.user?.id;
      if (authUserId) {
        authCreatedSuccessfully = true;
        console.log('✅ Auth user créé:', authUserId);
      } else {
        console.error('❌ Auth returned no user id', authUser);
      }
    }

    // Fallback: si auth a échoué, générer un UUID pour public.User
    if (!authUserId) {
      authUserId = crypto.randomUUID();
      console.log('💾 Fallback: création dans public.User uniquement avec userId:', authUserId);
    }    // STEP 2: Sync to public.User
    console.log('📝 Synchronisation vers public.User...');
    const { data: createdUser, error: insertErr } = await client
      .from('User')
      .insert({
        id: authUserId,
        email,
        password: hashed,
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl ?? null,
        role: 'super_admin',
        tenantId: null,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single();

    if (insertErr) {
      console.error('❌ User sync failed:', insertErr);
      // Rollback: delete the auth user we just created
      try {
        await client.auth.admin.deleteUser(authUserId);
        console.log('↩️ Rolled back auth user creation');
      } catch (delErr) {
        console.error('❌ Failed to rollback auth user:', delErr);
      }
      return NextResponse.json({ error: 'User sync failed', details: insertErr.message }, { status: 500 });
    }

    // STEP 3: Find or create platform tenant and link super admin
    const { data: platformTenants, error: platformErr } = await client
      .from('Tenant')
      .select('id')
      .eq('isPlatform', true)
      .limit(1);

    let platformTenantId: string | null = null;

    if (!platformErr && platformTenants && platformTenants.length > 0) {
      platformTenantId = platformTenants[0].id;
    } else {
      // Create platform tenant
      platformTenantId = crypto.randomUUID();
      const { error: createErr } = await client
        .from('Tenant')
        .insert({
          id: platformTenantId,
          name: 'PLATFORM',
          plan: 'platform',
          isPlatform: true,
          superAdminId: authUserId,
          createdAt: now,
          updatedAt: now
        });

      if (createErr) {
        console.error('failed to create platform tenant', createErr);
        // Do NOT rollback user creation at this point; return success but warn
        return NextResponse.json({
          ok: true,
          user: createdUser,
          warning: 'Failed to create platform tenant'
        }, { status: 201 });
      }
    }

    // Link super admin to platform tenant if not already done
    if (platformTenantId) {
      const { error: updateErr } = await client
        .from('Tenant')
        .update({ superAdminId: authUserId, updatedAt: now })
        .eq('id', platformTenantId);

      if (updateErr) {
        console.error('failed to update platform tenant with super admin', updateErr);
        // Don't fail the entire request, user is created
      }
    }

    return NextResponse.json({
      ok: true,
      user: createdUser,
      authUser: authUser?.user ?? null,
      authCreated: authCreatedSuccessfully,
      fallback: !authCreatedSuccessfully,
      message: authCreatedSuccessfully ? 'User created in both auth.users and public.User' : 'User created in public.User only (auth.users creation failed - fallback mode)'
    }, { status: 201 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}