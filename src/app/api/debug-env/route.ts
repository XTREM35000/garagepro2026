import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    // Database
    databaseUrl: process.env.DATABASE_URL,
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

    timestamp: new Date().toISOString()
  });
}