// scripts/vercel-deploy.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Préparation du déploiement Vercel...');

// Charger les variables d'environnement depuis .env
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');

  if (fs.existsSync(envPath)) {
    console.log('📁 Chargement des variables depuis .env...');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = envFile.split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const [key, ...value] = line.split('=');
        return [key, value.join('=')];
      });

    envVars.forEach(([key, value]) => {
      if (key && value) {
        process.env[key] = value.replace(/"/g, '');
      }
    });
  } else {
    console.log('⚠️  Fichier .env non trouvé, utilisation des variables système...');
  }
}

try {
  // Charger les variables d'environnement
  loadEnv();

  // 1. Vérification des variables d'environnement
  console.log('1. 🔍 Vérification des variables d\'environnement...');
  const requiredEnvVars = ['DATABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'];

  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      console.error(`❌ Variable manquante: ${envVar}`);
      throw new Error(`Variable manquante: ${envVar}`);
    }
    const preview = process.env[envVar].length > 50
      ? process.env[envVar].substring(0, 50) + '...'
      : process.env[envVar];
    console.log(`✅ ${envVar}: ${preview}`);
  });

  // 2. Génération de Prisma
  console.log('2. 🔧 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // 3. Vérification du schéma
  console.log('3. 📊 Vérification du schéma de base de données...');
  try {
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  db push a échoué, continuation du build...');
  }

  // 4. Build Next.js - CORRECTION ICI
  console.log('4. 🏗️ Construction de l\'application Next.js...');
  execSync('npx next build', { stdio: 'inherit' }); // Ajout de npx

  console.log('🎉 ✅ Prêt pour le déploiement Vercel!');

} catch (error) {
  console.error('❌ Erreur lors de la préparation:', error.message);
  process.exit(1);
}