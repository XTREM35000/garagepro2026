import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Use admin client to bypass RLS and ensure we can read all users
    if (!supabaseAdmin) {
      return NextResponse.json({
        superAdminExists: false,
        tenantAdminExists: false,
        dbConnected: false,
        error: 'Supabase admin client not configured'
      }, { status: 500 });
    }

    const clientAny = supabaseAdmin as any;

    // Query for SUPER_ADMIN role
    const { data: superAdminUsers, error: superErr } = await clientAny
      .from('User')
      .select('id, role')
      .eq('role', 'SUPER_ADMIN')
      .limit(1);

    if (superErr) {
      console.error('[api/setup/status] superAdminUsers query error:', superErr);
      throw superErr;
    }

    // Query for TENANT_ADMIN role
    const { data: tenantAdminUsers, error: tenantErr } = await clientAny
      .from('User')
      .select('id, role')
      .eq('role', 'TENANT_ADMIN')
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