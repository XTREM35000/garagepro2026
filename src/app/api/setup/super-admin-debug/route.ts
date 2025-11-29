import { NextResponse } from "next/server";
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    console.log('🔧 DEBUG: Début API Super Admin');

    if (!supabaseAdmin) {
      console.error('❌ DEBUG: supabaseAdmin non initialisé');
      return NextResponse.json({
        error: 'Supabase Admin non disponible',
        details: 'supabaseAdmin is null'
      }, { status: 500 });
    }

    const body = await req.json();
    console.log('🔧 DEBUG: Body reçu:', body);

    // TEST 1: Connexion Supabase
    console.log('🔧 DEBUG: Test connexion Supabase...');
    const { data: testData, error: testError } = await supabaseAdmin
      .from('User')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ DEBUG: Erreur connexion Supabase:', testError);
      return NextResponse.json({
        error: 'Connexion DB échouée',
        details: testError
      }, { status: 500 });
    }

    console.log('✅ DEBUG: Connexion Supabase OK');

    // TEST 2: Vérifier si l'user existe
    console.log('🔧 DEBUG: Vérification user existant...');
    const { data: existingUsers, error: userError } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('email', body.email)
      .limit(1);

    if (userError) {
      console.error('❌ DEBUG: Erreur recherche user:', userError);
      return NextResponse.json({
        error: 'Recherche user échouée',
        details: userError
      }, { status: 500 });
    }

    console.log('✅ DEBUG: Recherche user OK - Existe:', existingUsers?.length > 0);

    return NextResponse.json({
      ok: true,
      message: "Debug - Tests API passés",
      tests: {
        supabaseConnected: true,
        userExists: existingUsers?.length > 0,
        existingUsers
      }
    }, { status: 200 });

  } catch (err: any) {
    console.error('💥 DEBUG: Erreur globale:', err);
    return NextResponse.json({
      error: "Erreur serveur debug",
      message: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}
