# Guide de Configuration et Développement SaaS Manager

## Mission du Projet

SaaS Manager est une plateforme complète de gestion d'abonnements SaaS qui inclut :
- Authentification utilisateur
- Gestion des abonnements avec Stripe
- Tableau de bord d'administration
- Interface utilisateur moderne et réactive

### Objectifs Clés
- Création d'un système d'authentification robuste
- Intégration de paiements sécurisés
- Gestion des rôles et permissions
- Interface utilisateur fluide et professionnelle

## Technologies Utilisées

### Stack Principale
- **Next.js 13+** (App Router) pour le framework
- **TypeScript** pour la sécurité type
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **React Query** pour la gestion d'état serveur

### Base de Données et Auth
- **Supabase** pour l'authentification et le stockage
- **Prisma** pour l'ORM
- **PostgreSQL** comme base de données

### Paiements et Webhooks
- **Stripe** pour la gestion des paiements
- **Webhooks** pour les événements Stripe et Supabase

## Architecture Prisma + Supabase

L'utilisation combinée de Prisma et Supabase nécessite une configuration spécifique :

### 1. Configuration Supabase
\`\`\`env
# .env.local
NEXT_PUBLIC_SUPABASE_URL="votre_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_clé_anon"
SUPABASE_SERVICE_ROLE_KEY="votre_clé_service"
\`\`\`

### 2. Configuration Prisma
\`\`\`prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modèles synchronisés avec Supabase
model User {
  id         String   @id
  email      String   @unique
  createdAt  DateTime @default(now())
  // Autres champs...
}
\`\`\`

### 3. Synchronisation avec Supabase Auth
- Les utilisateurs sont créés dans Supabase Auth
- Prisma synchronise les données via des triggers PostgreSQL
- Utilisation du même pool de connexion PostgreSQL

### 4. Workflow TypeScript
\`\`\`typescript
// Types générés automatiquement
import type { Database } from '@/types/supabase'
import type { User } from '@prisma/client'

// Utilisation des types
type SupabaseUser = Database['public']['Tables']['users']['Row']
type PrismaUser = User
\`\`\`

## Éléments Restant à Implémenter

### 1. Authentification
- [x] Configuration Supabase
- [x] Composants de connexion/inscription
- [ ] Récupération de mot de passe
- [ ] Vérification email
- [ ] OAuth (Google, GitHub)

### 2. Base de Données
- [x] Configuration Prisma
- [x] Modèles de base
- [ ] Migrations de production
- [ ] Optimisation des requêtes
- [ ] Caching avec Redis

### 3. Fonctionnalités SaaS
- [ ] Plans d'abonnement
- [ ] Intégration Stripe
- [ ] Webhooks de paiement
- [ ] Gestion des factures
- [ ] Période d'essai

### 4. Interface Utilisateur
- [x] Layout de base
- [x] Navigation responsive
- [ ] Tableau de bord utilisateur
- [ ] Page de paramètres
- [ ] Interface d'administration

### 5. Performance et Sécurité
- [ ] Middleware de rate limiting
- [ ] Validation des données (Zod)
- [ ] Tests E2E (Playwright)
- [ ] Monitoring
- [ ] Logs d'audit

## Déploiement

### Configuration Production
1. Configurer Vercel/Railway
2. Configurer les variables d'environnement
3. Configurer les webhooks Stripe
4. Mettre en place le monitoring

### CI/CD
- GitHub Actions pour les tests
- Déploiement automatique sur Vercel
- Vérification des types et linting

## Maintenance

### Backups
- Configuration des backups Supabase
- Export régulier des données Stripe
- Sauvegarde des logs

### Monitoring
- Uptime checking
- Performance monitoring
- Error tracking

## Points d'Attention

### Sécurité
- Ne jamais exposer les clés admin
- Valider toutes les entrées utilisateur
- Utiliser HTTPS partout
- Mettre en place un WAF

### Performance
- Optimiser les requêtes Prisma
- Utiliser le cache quand possible
- Lazy loading des composants
- Optimisation des images

## Scripts Utiles

### Installation
\`\`\`bash
npm install
npx prisma generate
npx supabase init
\`\`\`

### Développement
\`\`\`bash
npm run dev          # Démarre le serveur de dev
npm run build       # Build de production
npm run typecheck   # Vérifie les types
npm run lint        # Lint du code
\`\`\`

## Resources

### Documentation
- [Next.js App Router](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [Stripe](https://stripe.com/docs)

### Tutoriels Recommandés
- Configuration Supabase + Next.js
- Intégration Stripe Checkout
- Déploiement sur Vercel

## Contribution

### Guidelines
- Utiliser les conventional commits
- Créer des pull requests
- Documenter les changements
- Suivre le style de code établi

### Process
1. Créer une branche feature
2. Développer et tester
3. Créer une PR
4. Review et merge

## Exemples et templates (pratique)

### `.env.example` (modèle)
```env
# URL publique et clé anonyme (frontend)
NEXT_PUBLIC_SUPABASE_URL="https://xyzcompany.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"

# Clé service role (NE JAMAIS exposer côté client)
# Utiliser uniquement côté serveur (ex: Vercel environment variables)
SUPABASE_SERVICE_ROLE_KEY="service-role-key"

# Base de données
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### `schema.prisma` (exemple minimal)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id         String   @id @default(uuid())
  email      String   @unique
  firstName  String?
  lastName   String?
  avatarUrl  String?
  createdAt  DateTime @default(now())
}
```

### Commandes utiles
- Générer le client Prisma : `npx prisma generate`
- Créer une migration : `npx prisma migrate dev --name init`
- Supabase CLI (initialiser / créer bucket) : `npx supabase login` puis `npx supabase storage bucket create avatars --public` (ou utiliser le dashboard)

## Création du bucket `avatars` (Supabase)

Option A — Dashboard UI :
- Ouvrir le projet sur app.supabase.com
- Menu -> Storage -> Buckets -> New bucket
- Nommer `avatars` et choisir public/private selon besoin

Recommandation :
- Si vous préférez que les avatars ne soient pas directement publics, créez le bucket en privé et utilisez les signed URLs côté serveur (c'est ce que fait l'API d'upload fournie).

Option B — CLI :
```powershell
# Se connecter
npx supabase login

# Créer le bucket public
npx supabase storage bucket create avatars --public
```

> Si la commande CLI n'est pas disponible, créer via le Dashboard est la méthode la plus simple.

## Déploiement et CI/CD

### Variables d'environnement (exemples pour Vercel)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY  (server only)
- DATABASE_URL
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Sur Vercel : Project Settings -> Environment Variables -> ajouter les variables pour `Production` et `Preview`.

### Exemple simple GitHub Actions (CI)
Copier ce snippet dans `.github/workflows/ci.yml` pour une CI basique qui lint, typecheck et build :

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm -s lint || true
      - run: pnpm -s typecheck || true
      - run: pnpm -s build

```

Adaptez `pnpm` -> `npm` ou `yarn` selon votre gestionnaire.

## Tests et validation rapide

- Ajouter au moins un test d'intégration minimal pour l'endpoint d'upload (`/api/upload/avatar`).
- Recommandation : utiliser `vitest` ou `jest` + `supertest` pour tester la route côté serveur en mockant `supabaseAdmin`.

Exemple de test rapide (concept) :

1. Mockez `supabaseAdmin` pour retourner une erreur quand service key manquante et vérifier que l'API renvoie 500 et message clair.
2. Mockez un upload réussi et vérifiez que la réponse contient `publicUrl` ou `signedUrl`.

## Troubleshooting & FAQ

Q: J'obtiens "StorageApiError: Bucket not found" lors de l'upload
- Vérifiez que le bucket `avatars` existe dans Supabase (Dashboard -> Storage -> Buckets).
- Si vous avez créé un bucket privé et ne fournissez pas de signed URL, le fichier ne sera pas accessible.

Q: L'API côté serveur renvoie une erreur sur la clé admin
- Assurez-vous que `SUPABASE_SERVICE_ROLE_KEY` est défini dans les variables d'environnement côté serveur (Vercel, Railway, etc.).

Q: Comment rendre les avatars privés mais accessibles depuis l'app ?
- Créez le bucket en privé et utilisez `createSignedUrl` côté serveur pour générer des URLs temporaires (ex : 24h). Stockez le chemin (path) dans la DB, pas l'URL signée permanente.

Q: Puis-je stocker l'avatar directement dans la table `User` ?
- Mieux : stockez le `avatar_url` (ou le `avatar_path`) dans la colonne `avatarUrl` et servez les images via signed URL ou via un reverse-proxy si nécessaire.

## Checklist pour la livraison finale

- [ ] Créer le bucket `avatars` sur Supabase
- [ ] Mettre `SUPABASE_SERVICE_ROLE_KEY` dans les variables d'env de production
- [ ] Lancer les migrations Prisma (`npx prisma migrate deploy`) en production
- [ ] Configurer les webhooks Stripe et vérifier la signature
- [ ] Mettre en place la CI (ex: GitHub Actions snippet ci-dessus)
- [ ] Ajouter tests d'intégration pour l'endpoint d'upload

## Notes finales

Ce document est un template de référence pour démarrer et déployer l'application. Il peut être adapté et enrichi en fonction des besoins du projet (par ex. multi-tenant, SSO, stockage privé d'assets, etc.).

Si vous voulez, je peux :
- créer le fichier `.github/workflows/ci.yml` automatiquement dans le repo ;
- ajouter un test minimal (Vitest) pour l'endpoint d'upload ;
- créer un fichier `prisma/schema.prisma` d'exemple dans le repo.

Indiquez ce que vous voulez que je fasse ensuite — je peux appliquer automatiquement ces changements.