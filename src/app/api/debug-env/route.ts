import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    // Database
    databaseUrl: process.env.DATABASE_URL?.substring(0, 100) + '...',
    databaseUrlValid: process.env.DATABASE_URL?.includes('mgnukermjfidhmpyrxyl'),
    databaseUrlInvalid: process.env.DATABASE_URL?.includes('tpbfszuvltclkdsjxrgw'),

    // Supabase
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseUrlValid: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('mgnukermjfidhmpyrxyl'),
    supabaseUrlInvalid: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('tpbfszuvltclkdsjxrgw'),

    // Environment
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    region: process.env.VERCEL_REGION,

    timestamp: new Date().toISOString(),
    status: process.env.DATABASE_URL?.includes('mgnukermjfidhmpyrxyl') ? '✅ CONFIGURATION CORRECTE' : '❌ MAUVAISE CONFIGURATION'
  };

  return NextResponse.json(config);
}