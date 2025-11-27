# Résolution — Problème création utilisateur Supabase / Trigger DB

Date : 20 novembre 2025
Contexte : dépôt `garagepro2026` (projet `saas-manager`).

Résumé du symptôme
- Lors d'un POST vers `/api/setup/super-admin`, l'appel `supabaseAdmin.auth.admin.createUser(...)` échoue côté Supabase avec une erreur générique :
  `AuthApiError: Database error creating new user` (status 500, code `unexpected_failure`).
- Le payload envoyé contenait `user_metadata` et `raw_user_meta_data` (avec `tenant_id`, `role`, `avatarUrl`).

Analyse et cause probable
- Le message d'erreur côté Supabase est générique parce que l'erreur réelle se produit dans la base de données (généralement dans la fonction trigger qui s'exécute `AFTER INSERT ON auth.users`).
- Le projet avait un trigger SQL (migration `20251111140000_trigger_auto_create_user`) qui créait automatiquement une ligne dans `public."User"` lors de la création d'un utilisateur Supabase. Si la fonction trigger renvoie un échec (contrainte FK, type mismatch, champ manquant), Supabase retourne une erreur 500 générique.
- Il est probable que la fonction trigger existante sur la base (DB réelle) n'ait pas reçu ou attendu les mêmes clés de métadonnées (`tenant_id` vs `tenantId`, `avatarUrl` vs `avatar_url`), ou qu'elle ait tenté d'utiliser une valeur de fallback invalide (ex: la chaîne `'demo'` plutôt qu'un UUID), provoquant une contrainte et donc l'échec.

Actions effectuées dans le code (dépôt)
1. Migration/trigger mise à jour
   - Fichier modifié : `prisma/migrations/20251111140000_trigger_auto_create_user/migration.sql`
   - Objectif : rendre la fonction `handle_new_user()` plus robuste en lisant les métadonnées depuis `raw_user_meta_data` OU `user_metadata`, en supportant `tenant_id` (snake_case) et `tenantId` (camelCase), et en résolvant `role` et `avatarUrl` depuis ces deux sources.
   - Ajout d'un fallback explicite vers l'ID global `00000000-0000-0000-0000-000000000000` si aucun tenant présent.
   - Le code du trigger mis à jour est inclus ci-dessous (identique au contenu du fichier de migration édité dans le dépôt).

2. Logging et capture d'erreur améliorée
   - Fichier modifié : `src/app/api/setup/super-admin/route.ts`
   - Action : ajout d'un `console.log` du `payload` envoyé à Supabase, et enveloppement de l'appel `createUser()` dans un `try/catch` qui remonte plus de détails (message, status, data) afin d'aider le diagnostic.

Pourquoi l'erreur persiste (état réel)
- Modifier le fichier `prisma/migrations/.../migration.sql` dans le dépôt n'applique pas automatiquement le changement dans la base de données Supabase. La fonction trigger active sur la base peut rester l'ancienne version, donc l'appel `createUser` continue d'échouer jusqu'à ce que la nouvelle définition de la fonction soit appliquée dans la base.

Étapes recommandées (à exécuter maintenant)
1) Appliquer la nouvelle définition du trigger dans la base Supabase

Option A (recommandée, interface Supabase) — SQL Editor (plus simple)
- Ouvrir le `SQL Editor` du projet Supabase (Dashboard).
- Coller TOUT le bloc SQL ci-dessous (il remplace/CREATE OR REPLACE la fonction) et exécuter.

Option B (CLI / psql)
- Exécuter depuis un terminal (si `psql` installé) :

```powershell
# Remplacez DATABASE_URL par la valeur réelle (ou utilisez la variable d'environnement)
psql "${env:DATABASE_URL}" -c "$(< path/to/trigger.sql)"
```

(Remarque : sur Windows PowerShell, utilisez les guillemets doubles et vérifiez que psql est dans le PATH.)

---
SQL à exécuter (copier-coller dans Supabase SQL editor)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  tenant_id_to_use text;
  role_from_meta text;
  avatar_from_meta text;
BEGIN
  -- Resolve tenant_id: prefer raw_user_meta_data, then user_metadata (snake/camel), then first tenant, then GLOBAL fallback
  tenant_id_to_use := COALESCE(
    new.raw_user_meta_data->>'tenant_id',
    new.user_metadata->>'tenant_id',
    new.user_metadata->>'tenantId',
    (SELECT id FROM public."Tenant" ORDER BY "createdAt" ASC LIMIT 1),
    '00000000-0000-0000-0000-000000000000'
  );

  -- Resolve role and avatar from either raw_user_meta_data or user_metadata
  role_from_meta := COALESCE(
    new.raw_user_meta_data->>'role',
    new.user_metadata->>'role',
    'viewer'
  );

  avatar_from_meta := COALESCE(
    new.raw_user_meta_data->>'avatarUrl',
    new.user_metadata->>'avatarUrl',
    new.user_metadata->>'avatar_url'
  );

  INSERT INTO public."User" (
    "id",
    "name",
    "role",
    "avatarUrl",
    "tenantId",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    new.id::text,
    COALESCE((new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name'), new.id::text),
    role_from_meta,
    avatar_from_meta,
    tenant_id_to_use,
    now(),
    now()
  )
  ON CONFLICT ("id") DO UPDATE
  SET
    "name" = COALESCE((new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name'), new.id::text),
    "role" = role_from_meta,
    "avatarUrl" = avatar_from_meta,
    "updatedAt" = now()
  WHERE public."User"."id" = new.id::text;

  RETURN new;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```
---

2) Tester la création d'un super_admin
- Relancer le serveur dev :

```powershell
npm run dev
```

- Dans l'UI `/setup` ou via curl/Postman, effectuer la même requête POST que précédemment.
- Observer la console du serveur pour deux choses :
  - Le `Supabase createUser payload:` (déjà ajouté dans le code) — vérifier que `tenant_id` est bien présent et que `avatarUrl` est une URL valide.
  - Si l'erreur survient encore, la nouvelle réponse JSON inclura `details` (message/status/data). Copiez-les ici.

3) Vérifier les tables dans Supabase
- Ouvrir `Table Editor` dans Supabase Dashboard :
  - Vérifier `auth.users` : un nouvel enregistrement a été créé (ou non).
  - Vérifier `public.User` : la fonction trigger doit avoir créé la ligne correspondante avec le même `id`.

4) En cas d'échec persistant
- Récupérer les logs Postgres / DB dans Supabase (Project -> Logs -> Database) et copier l'erreur SQL complète (contrainte violée, détail de la requête) ici.
- Si vous ne pouvez pas exécuter le SQL de remplacement ci-dessus, une solution de contournement immédiate est :
  - Désactiver temporairement le trigger (DROP TRIGGER), appeler `createUser` (il réussira mais il n'y aura pas de ligne dans `public.User`), puis créer manuellement la ligne `public.User` via Prisma ou via SQL. Puis recréer le trigger.

Notes techniques importantes
- Éditer un fichier de migration déjà livré dans Git ne met pas à jour la base automatiquement. Il faut appliquer la modification au serveur DB (via `prisma migrate deploy` ou en exécutant le SQL manuellement). Pour des modifications de fonctions/triggers, l'éditeur SQL du projet Supabase est la manière la plus directe et sûre.
- Après application du SQL, la nouvelle définition de la fonction sera active immédiatement.

Checklist de vérification rapide
- [ ] Avoir appliqué la fonction trigger mise à jour dans la base (via SQL editor ou psql)
- [ ] Relancer `npm run dev`
- [ ] Re-tester la création de `super_admin`
- [ ] Confirmer que `auth.users` et `public.User` contiennent les lignes correspondantes

Annexes
- Fichiers modifiés dans le dépôt :
  - `prisma/migrations/20251111140000_trigger_auto_create_user/migration.sql` (modification du trigger)
  - `src/app/api/setup/super-admin/route.ts` (logging + try/catch pour createUser)


Fin du document.
