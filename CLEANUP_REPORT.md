# CLEANUP_REPORT

Branche: `cleanup/archive-20251127`
Date: 2025-11-27
Auteur: Copilote (automated changes)

Résumé
------
Cette branche contient l'archivage des fichiers non critiques et/ou obsolètes vers le dossier `archive/` pour revue avant suppression définitive.
Vous avez demandé de garder certains fichiers (non déplacés) et de procéder à l'archivage des autres afin de tester pendant 24h avant merge.

Fichiers/dossiers archivés
--------------------------
archive/docs/
- 01-setup.md — doc d'installation ancienne
- DELIVERY_CHECKLIST.md — checklist de livraison historique
- DELIVERY_FINAL.md — livrable final (archive)
- EXEC_SUMMARY.md — résumé exécutif historique
- instructions.md — instructions diverses
- instructions_full.md — instructions complètes
- MODALS_GUIDE.md — guide composants modaux
- resolve01.md — notes de résolution
- setup-avatars-bucket.md — instructions bucket avatars
- signup-trigger-setup.md — guide trigger signup

archive/logs/
- build_output.txt — log de build (déplacé)
- lint_output.txt — log lint (déplacé)
- tsc_output.txt — log tsc (déplacé)

archive/project-structure/
- project_structure.txt
- project_structure_1.txt
- project_structure_2.txt
- project_structure_3.txt
(Le fichier `project_structure_4.txt` n'a pas été touché - il est explicitement exclu de la suppression.)

archive/scripts/
- pooler.js — script utilitaire (archivé)
- test-no-ssl.js — script de test (archivé)
- test-endpoint.js — script de test (archivé)
- test-avatar-upload.mjs — script de test avatar (archivé)
- liste.mjs — script utilitaire (archivé)

archive/legacy/
- AuthCardLegacy.tsx — version legacy de la carte d'auth (archivée)

Fichiers laissés en place (non archivés)
---------------------------------------
- `project_structure_4.txt` (conservé selon votre liste d'exclusions)
- `COMPLETE_GUIDE.md`, `documentation.md`, `email_confirmed.md`, `structure.md` (conservés)
- Scripts de déploiement: `vercel-deploy.js`, `deploy.ps1`, `deploy-fast.ps1` (non archivés)
- Endpoints API debug/diagnostic: `src/app/api/db-proxy`, `src/app/api/test-db`, `src/app/api/debug` (non déplacés)
- Migrations Prisma : `prisma/migrations/*` (non déplacés)
- Composants actifs (modals, draggable, auth-card, ModalPro) (non déplacés)
- Pages `billing/`, `pricing/`, `setup/` (gardées)

Raisons et recommandations
--------------------------
- Les fichiers archivés sont majoritairement des dumps/logs, docs historiques, petits scripts de test et une version legacy d'un composant. Ils ont été déplacés pour diminuer le "bruit" dans la racine du repo sans suppression définitive.
- Les migrations Prisma n'ont PAS été supprimées : elles doivent être vérifiées via `npx prisma migrate status` et un dump SQL avant toute suppression définitive.
- Les endpoints `api/debug`, `db-proxy`, `test-db` n'ont pas été déplacés car ils peuvent être utiles pour le diagnostic; les sécuriser (restreindre l'accès en prod) est recommandé si vous ne comptez pas les garder.

Étapes recommandées avant merge
-------------------------------
1. Sur la branche `cleanup/archive-20251127`, exécuter la CI (build, lint, type-check) :
```powershell
npm run build
npm run lint
npm run type-check
```
2. Tester manuellement les flows critiques (auth, onboarding, upload avatar, dashboard actions) pendant 24h.
3. Valider que personne d'autre a besoin des docs archivées (références dans README ou tickets).
4. Optionnel : si tout OK, supprimer définitivement les fichiers archivés et merger la branche.

Commandes utiles
----------------
- Créer un dump SQL avant touchers les migrations (exemple PostgreSQL) :
```powershell
pg_dump --schema-only --file=prisma/schema-backup.sql $DATABASE_URL
```
- Vérifier statut des migrations :
```powershell
npx prisma migrate status --schema=prisma/schema.prisma
```
- Pour restaurer un fichier archivé (exemple) :
```powershell
git checkout origin/cleanup/archive-20251127 -- archive/docs/DELIVERY_CHECKLIST.md
```

Fin du rapport.
