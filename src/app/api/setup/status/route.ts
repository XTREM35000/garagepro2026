export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  let superAdminExists = false;
  let tenantAdminExists = false;
  let dbConnected = false;

  try {
    if (!supabaseAdmin) {
      console.error('/api/setup/status: supabase admin client not configured')
      return NextResponse.json({ superAdminExists, tenantAdminExists, dbConnected, needsSetup: true })
    }

    // Try a small query against our User table to ensure connection
    const { data: superData, error: superErr } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('role', 'SUPER_ADMIN')
      .limit(1)

    if (!superErr) {
      dbConnected = true
      superAdminExists = Array.isArray(superData) && superData.length > 0
    } else {
      console.error('supabase super admin check error', superErr)
    }

    const { data: tenantData, error: tenantErr } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('role', 'TENANT_ADMIN')
      .limit(1)

    if (!tenantErr) {
      tenantAdminExists = Array.isArray(tenantData) && tenantData.length > 0
    } else {
      console.error('supabase tenant admin check error', tenantErr)
    }

  } catch (err: any) {
    console.error('Error in /api/setup/status:', err?.message ?? err)
    return NextResponse.json({ superAdminExists, tenantAdminExists, dbConnected, error: String(err), needsSetup: true }, { status: 200 })
  }

  return NextResponse.json({ superAdminExists, tenantAdminExists, dbConnected, needsSetup: !superAdminExists }, { status: 200 })
}