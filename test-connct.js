const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Test de connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion réussie!');

    // Testez une requête simple
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('📊 Version PostgreSQL:', result);

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('Détails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();