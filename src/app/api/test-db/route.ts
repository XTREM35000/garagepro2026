import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const diagnostic: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? 'true' : 'false',
    region: process.env.VERCEL_REGION || 'local'
  }

  console.log('🔍 Début du diagnostic DB (Supabase)')
  console.log('📊 Environnement:', diagnostic)

  try {
    if (!supabaseAdmin) {
      diagnostic['overall'] = '❌ Supabase admin client not configured'
      return NextResponse.json({ success: false, diagnostic, error: { message: 'Supabase admin client not configured' } }, { status: 500 })
    }

    const client = supabaseAdmin as any

    // Test: simple select/count
    console.log('1. 🔎 Test Tenant select/count...')
    const { data: tenants, count, error: tenantsErr } = await client.from('Tenant').select('id', { count: 'exact' }).limit(100)
    if (tenantsErr) throw tenantsErr
    diagnostic['tenants_count'] = count ?? (Array.isArray(tenants) ? tenants.length : 0)
    diagnostic['test_tenants_sample'] = Array.isArray(tenants) && tenants.length > 0 ? tenants[0] : null

    // Test: ping a light table (Tenant) exists
    console.log('2. ✅ Tenant table accessible')

    // Environment checks
    diagnostic['env'] = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length,
      hasDirectUrl: !!process.env.DIRECT_URL,
      nodeEnv: process.env.NODE_ENV
    }

    diagnostic['overall'] = '✅ Diagnostic Supabase passed'

    return NextResponse.json({ success: true, diagnostic, summary: { status: 'healthy', database: 'connected', timestamp: diagnostic.timestamp } }, { status: 200 })
  } catch (err: any) {
    console.error('💥 ERREUR lors du diagnostic:', err)
    diagnostic['error'] = { message: err?.message ?? String(err), code: err?.code }
    diagnostic['overall'] = '❌ Échec du diagnostic'
    return NextResponse.json({ success: false, diagnostic, error: { message: err?.message ?? String(err), suggestion: 'Check Supabase config and service role key' } }, { status: 500 })
  }
}