// scripts/vercel-deploy.js
const { execSync } = require('child_process');

console.log('🚀 Préparation du déploiement Vercel...');

try {
  // 1. Vérification des variables d'environnement
  console.log('1. 🔍 Vérification des variables d\'environnement...');
  const requiredEnvVars = ['DATABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'];

  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      throw new Error(`Variable manquante: ${envVar}`);
    }
    console.log(`✅ ${envVar}: Présente`);
  });

  // 2. Génération de Prisma
  console.log('2. 🔧 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 3. Vérification du schéma
  console.log('3. 📊 Vérification du schéma de base de données...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });

  // 4. Build Next.js
  console.log('4. 🏗️ Construction de l\'application Next.js...');
  execSync('next build', { stdio: 'inherit' });

  console.log('✅ Prêt pour le déploiement Vercel!');

} catch (error) {
  console.error('❌ Erreur lors de la préparation:', error.message);
  process.exit(1);
}