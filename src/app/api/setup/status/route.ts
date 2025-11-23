export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "fra1";

import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let superAdminExists = false;
  let tenantAdminExists = false;

  try {
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
        auth: { persistSession: false },
        global: { fetch },
      });

      try {
        const { data: superData, error: superErr } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('role', 'super_admin')
          .limit(1);
        if (!superErr && Array.isArray(superData) && superData.length > 0) superAdminExists = true;
        else if (superErr) console.error('Supabase super_admin error:', superErr.message ?? superErr);
      } catch (err: any) { console.error('Supabase super_admin query failed:', err); }

      try {
        const { data: tenantData, error: tenantErr } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .limit(1);
        if (!tenantErr && Array.isArray(tenantData) && tenantData.length > 0) tenantAdminExists = true;
        else if (tenantErr) console.error('Supabase admin error:', tenantErr.message ?? tenantErr);
      } catch (err: any) { console.error('Supabase admin query failed:', err); }

    } else {
      const superAdmin = await prisma.user.findFirst({ where: { role: 'super_admin' } });
      const tenantAdmin = await prisma.user.findFirst({ where: { role: 'admin' } });
      superAdminExists = !!superAdmin;
      tenantAdminExists = !!tenantAdmin;
    }
  } catch (err: any) {
    console.error('Unexpected error in /api/setup/status:', err?.message ?? err);
  }

  return NextResponse.json({ superAdminExists, tenantAdminExists }, { status: 200 });
}
