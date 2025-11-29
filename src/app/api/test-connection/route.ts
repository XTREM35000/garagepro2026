import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🌐 Test connexion réseau...");
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    // Test ping simple
    const response = await fetch(supabaseUrl + '/rest/v1/', {
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });
    
    console.log("📡 Status:", response.status);
    console.log("📡 Headers:", Object.fromEntries(response.headers));
    
    if (!response.ok) {
      return NextResponse.json({
        error: "Connexion Supabase échouée",
        status: response.status,
        statusText: response.statusText
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: "✅ Connexion Supabase OK",
      status: response.status
    });
    
  } catch (err: any) {
    console.log("💥 Erreur réseau:", err.message);
    return NextResponse.json({
      error: "Erreur réseau",
      message: err.message,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL
    }, { status: 500 });
  }
}
