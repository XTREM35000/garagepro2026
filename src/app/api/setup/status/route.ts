import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Use admin client to bypass RLS and ensure we can read all users
    if (!supabaseAdmin) {
      // Don't throw 500 here; return a 200 with dbConnected false so the frontend can show setup hints
      return NextResponse.json({
        superAdminExists: false,
        tenantAdminExists: false,
        dbConnected: false,
        error: 'Supabase admin client not configured (check SUPABASE_SERVICE_ROLE_KEY)'
      }, { status: 200 });
    }

    const clientAny = supabaseAdmin as any;

    // Query for super_admin role (matching DB values)
    const { data: superAdminUsers, error: superErr } = await clientAny
      .from('User')
      .select('id, role')
      .eq('role', 'super_admin')
      .limit(1);

    if (superErr) {
      console.error('[api/setup/status] superAdminUsers query error:', superErr);
      throw superErr;
    }

    // Query for tenant admin role (named 'admin' in Prisma schema)
    const { data: tenantAdminUsers, error: tenantErr } = await clientAny
      .from('User')
      .select('id, role')
      .eq('role', 'admin')
      .limit(1);

    if (tenantErr) {
      console.error('[api/setup/status] tenantAdminUsers query error:', tenantErr);
      throw tenantErr;
    }

    const superAdminExists = Array.isArray(superAdminUsers) && superAdminUsers.length > 0;
    const tenantAdminExists = Array.isArray(tenantAdminUsers) && tenantAdminUsers.length > 0;

    console.log('[api/setup/status] superAdminUsers:', superAdminUsers, 'tenantAdminUsers:', tenantAdminUsers);

    return NextResponse.json({
      superAdminExists,
      tenantAdminExists,
      dbConnected: true,
      debug: {
        superAdminCount: superAdminUsers?.length || 0,
        tenantAdminCount: tenantAdminUsers?.length || 0
      }
    });

  } catch (error: any) {
    console.error('[api/setup/status] error:', error);
    return NextResponse.json({
      superAdminExists: false,
      tenantAdminExists: false,
      dbConnected: false,
      error: error.message
    }, { status: 500 });
  }
}