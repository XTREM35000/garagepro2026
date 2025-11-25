import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Utilise l'API REST Supabase
    const { data: users, error } = await supabase
      .from('User')
      .select('role');

    if (error) throw error;

    const superAdminExists = users?.some(user => user.role === 'SUPER_ADMIN') || false;
    const tenantAdminExists = users?.some(user => user.role === 'TENANT_ADMIN') || false;

    return NextResponse.json({
      superAdminExists,
      tenantAdminExists,
      dbConnected: true
    });

  } catch (error: any) {
    return NextResponse.json({
      superAdminExists: false,
      tenantAdminExists: false,
      dbConnected: false,
      error: error.message
    });
  }
}