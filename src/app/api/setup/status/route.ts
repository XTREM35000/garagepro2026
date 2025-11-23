export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "fra1";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

/**
 * Robust /api/setup/status
 * - Always returns { superAdminExists: boolean, tenantAdminExists: boolean }
 * - Never throws 500 to the client; falls back to {false,false} on error
 * - Uses SUPABASE_SERVICE_ROLE_KEY server-side when available
 * - Falls back to Prisma if service role missing
 */
export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

  let superAdminExists = false
  let tenantAdminExists = false

  try {
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
      // Server-only Supabase client using service role (never exposed to client)
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
        auth: { persistSession: false },
        global: { fetch },
      })

      // Check super admin
      try {
        const { data: superData, error: superErr } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('role', 'super_admin')
          .limit(1)

        if (superErr) {
          // Table might not exist or other db error — log and continue
          console.error('supabase admin select super_admin error:', superErr.message ?? superErr)
        } else if (Array.isArray(superData) && superData.length > 0) {
          superAdminExists = true
        }
      } catch (err: any) {
        console.error('supabase admin query failed (super_admin):', err)
      }

      // Check tenant admin (role 'admin')
      try {
        const { data: tenantData, error: tenantErr } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('role', 'admin')
          .limit(1)

        if (tenantErr) {
          console.error('supabase admin select admin error:', tenantErr.message ?? tenantErr)
        } else if (Array.isArray(tenantData) && tenantData.length > 0) {
          tenantAdminExists = true
        }
      } catch (err: any) {
        console.error('supabase admin query failed (admin):', err)
      }
    } else {
      // Supabase service role not configured — fallback to Prisma server check
      try {
        const superAdmin = await prisma.user.findFirst({ where: { role: 'super_admin' } })
        const tenantAdmin = await prisma.user.findFirst({ where: { role: 'admin' } })
        superAdminExists = !!superAdmin
        tenantAdminExists = !!tenantAdmin
      } catch (err: any) {
        // If Prisma fails (table missing etc.), log and fall through to defaults
        console.error('Prisma check failed in /api/setup/status:', err?.message ?? err)
      }
    }
  } catch (err: any) {
    // Top-level safety: any unexpected error should not return 500 to client
    console.error('Unexpected error in /api/setup/status:', err?.message ?? err)
  }

  // Always return a valid JSON response with booleans (no 500)
  return NextResponse.json(
    {
      superAdminExists: !!superAdminExists,
      tenantAdminExists: !!tenantAdminExists,
    },
    { status: 200 }
  )
}
