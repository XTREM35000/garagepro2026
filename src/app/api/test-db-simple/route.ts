import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase admin client not configured' }, { status: 500 })
    }

    // Simple connectivity check: query a light table
    const { data, error } = await supabaseAdmin.from('Tenant').select('id').limit(1)
    if (error) throw error

    return NextResponse.json({
      success: true,
      database: 'connected',
      sample: Array.isArray(data) ? data.length : 0,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message ?? String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}