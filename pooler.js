// test-pooler-6543.js
const { PrismaClient } = require('@prisma/client');

// Utilise le pooler transaction mode
process.env.DATABASE_URL = "postgresql://postgres:S2024DiboMano@db.mgnukermjfidhmpyrxyl.supabase.co:6543/postgres";

async function test() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Pooler Transaction Mode OK!');
    console.log('✅ Pooler Transaction Mode OK!');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log(result[0]);
  } catch (e) {
    console.error('❌ Pooler error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();