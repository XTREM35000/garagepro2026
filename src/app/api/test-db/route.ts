import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const diagnostic: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? 'true' : 'false',
    region: process.env.VERCEL_REGION || 'local'
  };

  console.log('🔍 Début du diagnostic complet DB');
  console.log('📊 Environnement:', diagnostic);

  try {
    // Test 1: Connexion basique à Prisma
    console.log('1. 🔌 Test de connexion Prisma...');
    await prisma.$connect();
    diagnostic['test1_connection'] = '✅ Success';

    // Test 2: Requête simple
    console.log('2. 📋 Test requête findMany...');
    const tenants = await prisma.tenant.findMany();
    diagnostic['test2_findMany'] = {
      status: '✅ Success',
      count: tenants.length,
      sample: tenants.length > 0 ? {
        id: tenants[0].id,
        name: tenants[0].name
      } : null
    };

    // Test 3: Requête raw SQL
    console.log('3. 🗄️ Test requête SQL brute...');
    const rawResult = await prisma.$queryRaw`SELECT version() as version, now() as time`;
    diagnostic['test3_rawQuery'] = {
      status: '✅ Success',
      result: rawResult
    };

    // Test 4: Vérification des variables d'environnement (sans afficher les secrets)
    console.log('4. 🔐 Test variables d\'environnement...');
    diagnostic['test4_environment'] = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length,
      hasDirectUrl: !!process.env.DIRECT_URL,
      nodeEnv: process.env.NODE_ENV
    };

    // Test 5: Vérification du schéma
    console.log('5. 🗂️ Test vérification schéma...');
    const tableInfo = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'Tenant'
      ORDER BY ordinal_position
    `;
    diagnostic['test5_schema'] = {
      status: '✅ Success',
      tables: tableInfo
    };

    console.log('🎉 Diagnostic terminé avec succès!');
    diagnostic['overall'] = '✅ Tous les tests passent';

    return NextResponse.json({
      success: true,
      diagnostic,
      summary: {
        status: 'healthy',
        database: 'connected',
        tables: 'accessible',
        timestamp: diagnostic.timestamp
      }
    }, { status: 200 });

  } catch (err: any) {
    console.error('💥 ERREUR lors du diagnostic:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Stack:', err.stack);

    diagnostic['error'] = {
      message: err.message,
      code: err.code,
      name: err.name
    };
    diagnostic['overall'] = '❌ Échec du diagnostic';

    return NextResponse.json({
      success: false,
      diagnostic,
      error: {
        message: err.message,
        code: err.code,
        suggestion: getSuggestion(err)
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}

function getSuggestion(error: any): string {
  if (error.code === 'P1001') {
    return "Cannot reach database server. Check your DATABASE_URL and network connectivity.";
  }
  if (error.code === 'P1017') {
    return "Database connection closed. Check your connection limits.";
  }
  if (error.code === 'P1003') {
    return "Database does not exist. Verify the database name in your connection string.";
  }
  if (error.message.includes('SSL')) {
    return "SSL connection issue. Try adding ?sslmode=require to your DATABASE_URL.";
  }
  return "Check your database configuration and connection string.";
}