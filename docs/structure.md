# Structure de la base — modèles Prisma

Ce document décrit les modèles générés dans `prisma/schema.prisma` : champs importants, relations, clés primaires/étrangères et enums.

## Enums

- `UserRole` : super_admin, admin, agent_photo, caissier, comptable, comptable_instance, technicien, viewer
- `VehicleStatus` : EN_COURS, TERMINE, LIVRE
- `VehiclePhotoType` : ENTREE, SORTIE, DEGAT
- `CashType` : ENTREE, SORTIE
- `InvoiceStatus` : BROUILLON, PAYEE, ANNULEE
- `SubscriptionStatus` : ACTIVE, EXPIRE, EN_ATTENTE

---

## Tenant
- PK: `id` (String, uuid)
- Champs clés: `name`, `address?`, `logoUrl?`, `stripeId?` (indexé), `plan?`, `trialEnds?`, `createdAt`, `updatedAt`
- Relations (1:N): `users`, `vehicles`, `stockItems`, `invoices`, `subscriptions`, `cashRegisters`, `expenses`

Notes : `stripeId` a un index unique pour faciliter la liaison avec Stripe.

---

## Role
- PK: `id` (String, uuid)
- Champs: `name` (unique)
- Relations (1:N): `users`

---

## User
- PK: `id` (String, cuid())
- Champs clés: `email` (unique), `password?`, `name?`, `role` (enum `UserRole`), `tenantId`, `isActive` (par défaut true), `createdAt`, `updatedAt`
- FKs: `roleId` (relation explicite vers `Role`), `tenantId` → `Tenant.id`
- Relations: many `VehiclePhoto` (photos prises), `Invoice[]` (créées), `CashRegister[]` (caisse faite par), `Expense[]`

Index: `tenantId`, `email`.

OnDelete: les relations vers `Role` et `Tenant` sont configurées pour cascade (suppression du tenant ou rôle nettoie les utilisateurs associés selon le schéma).

---

## Vehicle
- PK: `id` (String, uuid)
- Champs: `marque`, `modele`, `immatricule` (unique), `status` (enum `VehicleStatus`), `dateEntree`, `dateSortie?`, `tenantId`, `createdAt`, `updatedAt`
- FK: `tenantId` → `Tenant.id`
- Relations: `photos` (VehiclePhoto[]), `invoice` (one-to-one optional)

Indexes: `tenantId`, `status`.

OnDelete: suppression du `Tenant` cascadera sur ses véhicules.

---

## VehiclePhoto
- PK: `id` (String, uuid)
- Champs: `type` (enum `VehiclePhotoType`), `url`, `takenById` (User), `vehicleId`, `createdAt`, `updatedAt`
- FKs: `takenById` → `User.id`, `vehicleId` → `Vehicle.id`, `tenantId` si présent dans votre version
- Relations: appartient à `User` (takenBy) et `Vehicle`

Indexes: `vehicleId`, `takenById`.

OnDelete: les suppressions User/Vehicle sont configurées pour cascade afin d'éviter orphelins.

---

## StockItem
- PK: `id` (String, uuid)
- Champs: `nom`, `categorie`, `quantite`, `prixAchat` (Decimal), `prixVente` (Decimal), `seuilAlerte` (Int), `tenantId`, `createdAt`, `updatedAt`
- FK: `tenantId` → `Tenant.id`
- Index: `tenantId`, `categorie`

OnDelete: suppression du tenant cascadera sur les items.

---

## CashRegister
- PK: `id` (String, uuid)
- Champs: `montant` (Decimal), `type` (enum `CashType`), `motif`, `faitParId` (User), `tenantId`, `createdAt`, `updatedAt`
- FKs: `faitParId` → `User.id`, `tenantId` → `Tenant.id`
- Indexes: `tenantId`, `faitParId`, `type`

OnDelete: suppression cascade depuis User ou Tenant.

---

## Invoice
- PK: `id` (String, uuid)
- Champs: `numero` (unique), `total` (Decimal), `statut` (enum `InvoiceStatus`), `vehicleId?` (optionnel, `@unique` si one-to-one), `clientNom`, `clientTel?`, `createdById?` (User), `tenantId`, `createdAt`, `updatedAt`
- FKs: `vehicleId` → `Vehicle.id`, `createdById` → `User.id`, `tenantId` → `Tenant.id`
- Indexes: `tenantId`, `vehicleId`, `statut`

Notes : `vehicleId` peut être marqué `@unique` pour refléter une relation 1:1 (un véhicule → une facture). Le schéma actuel applique `onDelete: SetNull` pour conserver les factures si le véhicule ou l'auteur disparaît.

---

## Subscription
- PK: `id` (String, uuid)
- Champs: `plan`, `status` (enum `SubscriptionStatus`), `stripeCustomerId?`, `stripeSubscriptionId?`, `tenantId`, `createdAt`, `updatedAt`
- FK: `tenantId` → `Tenant.id`
- Indexes: `tenantId`, `status`

OnDelete: cascade depuis Tenant.

---

## Expense
- PK: `id` (String, uuid)
- Champs: `libelle`, `montant` (Decimal), `categorie`, `faitParId` (User), `tenantId`, `createdAt`, `updatedAt`
- FKs: `faitParId` → `User.id`, `tenantId` → `Tenant.id`
- Indexes: `tenantId`, `faitParId`

OnDelete: cascade depuis User/Tenant.

---

## Remarques d'implémentation

- Tous les modèles dépendant d'un `Tenant` incluent `tenantId` et des index sur `tenantId` pour faciliter les requêtes multi-tenant.
- Les relations importantes utilisent `onDelete: Cascade` (sauf où indiqué `SetNull` pour préserver l'historique des factures quand l'entité référencée est supprimée).
- Types numériques monétaires : `Decimal` est utilisé pour éviter les problèmes d'arrondi.
- UUID vs CUID : les identifiants `User` utilisent `cuid()` dans le schéma pour compatibilité locale, mais vous pouvez harmoniser sur `uuid()` pour uniformité.

---

Si vous voulez, je peux :
- ajouter un diagramme ER (Mermaid) dans ce fichier ;
- générer un bref `prisma` snippet d'exemples d'usage (création d'un tenant + user + vehicle) ;
- créer une migration SQL explicite (fichiers SQL) et les committer.

*** Fin du document
# Documentation technique - SaaS Manager

## Architecture et structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts         # API Stripe Checkout
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts     # Webhooks Stripe
│   ├── auth/
│   │   └── page.tsx            # Page authentification
│   ├── billing/
│   │   └── page.tsx            # Gestion facturation
│   ├── pricing/
│   │   └── page.tsx            # Plans & tarifs
│   ├── globals.css             # Styles globaux
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Page d'accueil
├── components/
│   ├── hero/
│   │   └── hero.tsx
│   └── ui/                     # Composants réutilisables
│       ├── base-modal.tsx
│       ├── confirm-modal.tsx
│       ├── draggable-modal.tsx
│       ├── logo-animated.tsx   # Logo avec animations
│       ├── sidebar.tsx         # Menu latéral
│       ├── tabs.tsx
│       └── toast.tsx
├── config/
│   └── subscriptions.ts        # Configuration plans
├── lib/
│   ├── auth-context.tsx        # Contexte auth Supabase
│   ├── auth-hoc.tsx           # HOCs protection routes
│   ├── stripe.ts              # Client Stripe
│   ├── supabase.ts            # Client Supabase
│   └── utils.ts               # Utilitaires
├── types/
│   ├── env.d.ts               # Types env vars
│   └── index.ts               # Types partagés
└── middleware.ts              # Middleware auth

prisma/
├── schema.prisma              # Modèles de données
└── seed.ts                    # Seeding initial

scripts/
└── apply-rls.sh              # Config RLS Supabase
```

## Modèles de données (schema.prisma)

### Organisation
```prisma
model Organisation {
  id           String    @id @default(cuid())
  name         String
  tenant_id    String    @unique
  stripe_id    String?   @unique
  plan         String?   
  trial_ends   DateTime?
  created_at   DateTime  @default(now())
  settings     Settings?
  users        User[]
}
```

### User
```prisma
model User {
  id              String       @id @default(cuid())
  email           String      @unique
  name            String?
  role            UserRole    @default(viewer)
  organisation    Organisation @relation(fields: [organisation_id], references: [id])
  organisation_id String
  created_at      DateTime    @default(now())
}

enum UserRole {
  super_admin
  admin
  agent
  viewer
}
```

### Settings
```prisma
model Settings {
  id              String       @id @default(cuid())
  logo_url        String?
  company_name    String
  slogan          String?
  theme           String?     @default("light")
  rccm           String?
  organisation    Organisation @relation(fields: [organisation_id], references: [id])
  organisation_id String      @unique
}
```

## Variables d'environnement (.env)

```bash
# Base de données
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
SUPABASE_SERVICE_ROLE_KEY="xxx"

# Stripe
STRIPE_SECRET_KEY="sk_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_STRIPE_PK="pk_xxx"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
```

## Installation et développement

1. Cloner le repo et installer les dépendances :
```bash
git clone <repo>
cd saas-manager
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env.local
# Remplir les variables dans .env.local
```

3. Initialiser la base de données :
```bash
npm run db:push    # Synchro schema Prisma
npm run db:seed    # Création super_admin
```

4. Appliquer les règles RLS Supabase :
```bash
npm run apply-rls
```

5. Lancer en développement :
```bash
npm run dev
```

## Row Level Security (RLS)

Les règles RLS sont appliquées via `scripts/apply-rls.sh` :

- Isolation par `tenant_id`
- Super admin : accès total
- Admin : gestion de son organisation
- Agent/Viewer : lecture seule dans leur organisation

## Webhooks Stripe

Endpoints :
- `/api/checkout` : création session checkout
- `/api/webhooks/stripe` : gestion évènements Stripe

Events gérés :
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## UI/UX

Composants réutilisables :
- `Sidebar` : menu latéral animé (Framer Motion)
- `LogoAnimated` : logo avec animations
- `DraggableModal` : modale déplaçable
- `Toast` : notifications

Thème :
- TailwindCSS
- Shadcn/UI
- Animations Framer Motion

## Authentication

- Login/Signup via Supabase Auth
- Middleware de protection des routes
- Contexte auth global
- HOCs `withAuth` et `withRole`

## Facturation

Plans disponibles :
- Free
- Starter (29€/mois)
- Pro (99€/mois)

Gestion via Stripe :
- Checkout sessions
- Webhooks
- Customer portal
- Gestion trial

## Déploiement

1. Build production :
```bash
npm run build
```

2. Démarrer :
```bash
npm start
```

3. Configuration recommandée :
- Vercel pour l'application
- Supabase pour la base et l'auth
- Stripe en mode live

## Super Admin

Créé au seed :
- Email : 2024dibo@gmail.com
- Rôle : super_admin