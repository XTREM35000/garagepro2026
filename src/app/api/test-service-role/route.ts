import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log("🎯 TEST SERVICE ROLE - Début");
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ 
        error: "Variables manquantes",
        hasUrl: !!supabaseUrl,
        hasKey: !!serviceKey
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabase.from('User').select('count');
    
    if (error) {
      return NextResponse.json({ 
        error: "Erreur Supabase",
        code: error.code,
        message: error.message,
        hint: "Vérifie SERVICE_ROLE_KEY"
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: "✅ SERVICE ROLE FONCTIONNE!",
      data 
    });

  } catch (err: any) {
    return NextResponse.json({ 
      error: "Erreur serveur",
      message: err.message 
    }, { status: 500 });
  }
}
