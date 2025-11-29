import { NextResponse } from "next/server";

export async function GET() {
  // Info safe à montrer (pas les clés complètes)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  return NextResponse.json({
    status: "Diagnostic",
    supabaseUrl: supabaseUrl ? "✅ Configuré" : "❌ Manquant",
    serviceRoleKey: hasServiceKey ? "✅ Présent" : "❌ Manquant",
    serviceKeyLength: hasServiceKey ? process.env.SUPABASE_SERVICE_ROLE_KEY?.length : 0,
    nodeEnv: process.env.NODE_ENV
  });
}
