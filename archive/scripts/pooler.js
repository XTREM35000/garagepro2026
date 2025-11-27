// test-port-6543.js
const { PrismaClient } = require('@prisma/client');

process.env.DATABASE_URL = "postgresql://postgres:S2024DiboMano@db.mgnukermjfidhmpyrxyl.supabase.co:6543/postgres";

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log('🧪 Test port 6543...');
    await prisma.$connect();
    console.log('✅ Port 6543 OK!');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log(result[0]);
  } catch (e) {
    console.error('❌ Port 6543 error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();