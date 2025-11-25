// test-no-ssl.js
const { PrismaClient } = require('@prisma/client');

// Test sans vérification SSL
process.env.DATABASE_URL = "postgresql://postgres:S2024DiboMano@db.mgnukermjfidhmpyrxyl.supabase.co:5432/postgres?connect_timeout=30&sslmode=no-verify";

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log('🧪 Test sans vérification SSL...');
    await prisma.$connect();
    console.log('✅ Connexion sans SSL OK!');

    const result = await prisma.$queryRaw`SELECT version() as version, now() as time`;
    console.log('📊 PostgreSQL:', result[0].version);
    console.log('⏰ Heure serveur:', result[0].time);

  } catch (e) {
    console.error('❌ Erreur:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();