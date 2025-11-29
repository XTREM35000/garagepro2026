import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log("🚀 API ULTIME - Début");
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Client avec configuration ultime
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: {
          'X-Client-Info': 'nextjs-super-admin'
        }
      }
    });

    // TEST 1: Simple count
    console.log("🧪 Test 1: Count users...");
    const { data: countData, error: countError } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log("❌ Count error:", countError);
      return NextResponse.json({ 
        test: "count_failed",
        error: countError 
      }, { status: 500 });
    }

    // TEST 2: Insert test
    console.log("🧪 Test 2: Insert test user...");
    const testEmail = `test-${Date.now()}@test.com`;
    const { data: insertData, error: insertError } = await supabase
      .from('User')
      .insert({
        email: testEmail,
        name: 'Test User',
        password: 'temp',
        role: 'VIEWER'
      })
      .select();

    if (insertError) {
      console.log("❌ Insert error:", insertError);
      return NextResponse.json({ 
        test: "insert_failed", 
        error: insertError,
        hint: "RLS still blocking or schema issue"
      }, { status: 500 });
    }

    // TEST 3: Cleanup
    console.log("🧪 Test 3: Cleanup...");
    await supabase.from('User').delete().eq('email', testEmail);

    return NextResponse.json({ 
      success: true,
      message: "🎉 TOUS LES TESTS PASSÉS! Service Role fonctionne!",
      tests: {
        count: "✅",
        insert: "✅", 
        cleanup: "✅"
      },
      userCount: countData
    });

  } catch (err: any) {
    console.log("💥 Erreur globale:", err);
    return NextResponse.json({ 
      error: "Erreur serveur",
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}
