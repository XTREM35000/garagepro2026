# Documentation complète du projet

Ce document rassemble les informations essentielles pour comprendre la structure de la base, les commandes Prisma et les étapes de déploiement.

## Schéma Prisma

Le schéma se trouve dans `prisma/schema.prisma`. Il est conçu pour un SaaS multi-tenant gérant des garages (Tenants). Principaux modèles :
- Tenant, User, Role, Vehicle, VehiclePhoto, StockItem, CashRegister, Invoice, Subscription, Expense

Les enums disponibles sont listés dans `docs/structure.md`.

## Commandes Prisma utiles

- Formater le schéma:
```powershell
npx prisma format
```
- Valider le schéma (requiert DATABASE_URL chargé):
```powershell
$env:DATABASE_URL="<votre DATABASE_URL>"
npx prisma validate
```
- Pousser le schéma vers la DB (force reset) :
```powershell
$env:DATABASE_URL="<votre DATABASE_URL>"; npx prisma db push --force-reset
```
- Générer le client Prisma :
```powershell
npx prisma generate
```
- Créer une migration (create-only) :
```powershell
$env:DATABASE_URL="<votre DATABASE_URL>"; npx prisma migrate dev --name init --create-only
```

## Déploiement vers Supabase

1. Vérifiez que `DATABASE_URL` pointe vers la DB Supabase souhaitée.
2. Choisissez entre `prisma db push` (applique le schéma immédiatement) et Prisma Migrate (meilleur historique de migrations). Si vous utilisez `migrate`, appliquez `npx prisma migrate deploy` en prod.
3. Si vous utilisez `db push --force-reset`, attention : cela effacera les données existantes.

## Que contient le dépôt maintenant

- `prisma/schema.prisma` — schéma principal
- `prisma/migrations/` — migration SQL initiale créée en mode `--create-only`
- `docs/structure.md` — description des modèles et relations
- `docs/instructions.md` — guide d'installation et notes diverses

## Post-commit / push

- Pour pousser ces commits vers un remote :
```powershell
git remote add origin <URL_REMOTE>
git push -u origin main
```

## Remarques de sécurité

- Ne jamais committer vos vraies clés (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`). Utilisez `.env` et configurez les variables côté provider (Vercel, Railway...).

## Prochaines étapes recommandées

1. Ajouter tests d'intégration minimaux (ex: création Tenant + User) en utilisant une DB de test.
2. Ajouter CI qui valide le schéma (`npx prisma validate`) et exécute `npx prisma format`.
3. Décider du flux de migrations (db push vs migrate) et documenter la politique dans ce fichier.
