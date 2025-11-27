# Correction du flux d'inscription Supabase

## Problème
Lors de l'inscription via `/auth`, l'utilisateur est créé dans `auth.users` (système Supabase Auth), mais aucun enregistrement n'est créé dans la table `User` du schéma Prisma. Résultat : impossible de se connecter ensuite.

## Solution
Un **trigger PostgreSQL automatique** crée un enregistrement `User` chaque fois qu'un nouvel utilisateur s'inscrit via Supabase Auth.

## Étapes de mise en place

### 1. Exécuter le trigger (une seule fois)

Ouvre l'**Éditeur SQL** de ton projet Supabase (Dashboard → SQL Editor) et copie-colle le contenu du fichier :
```
prisma/migrations/20251111140000_trigger_auto_create_user/migration.sql
```

Puis appuie sur **Run** (ou Exécuter).

Résultat attendu : "Query successful" et le trigger `on_auth_user_created` est créé.

### 2. Tester l'inscription

Va à http://localhost:3000/auth et inscris-toi avec :
- Prénom : `Test`
- Nom : `User`
- Email : `test@example.com`
- Mot de passe : `SecurePass123!`

Attends la confirmation email et **clique sur le lien de confirmation** dans ton email.

### 3. Vérifier la base de données

Ouvre l'**Éditeur SQL** Supabase et exécute :
```sql
SELECT id, email, name, role, "tenantId" FROM "User" ORDER BY "createdAt" DESC LIMIT 1;
```

Tu devrais voir l'enregistrement de l'utilisateur créé automatiquement.

### 4. Se connecter

Va à http://localhost:3000/auth et connecte-toi avec tes identifiants.

## Comportement du trigger

- **Rôle par défaut** : `viewer` (tu peux le changer manuellement en `super_admin` dans la table si besoin).
- **TenantId par défaut** : `demo` (défini dans `raw_user_meta_data.tenant_id` ou sinon `demo`).
- **Nom** : combinaison de prénom + nom depuis les métadonnées d'inscription (ou email par défaut).

## Notes de sécurité

- Le trigger s'exécute avec `SECURITY DEFINER` (permissions élevées) pour créer les lignes. C'est nécessaire car les utilisateurs anon ne peuvent pas écrire dans `User` directement.
- Assure-toi que les **Row Level Security (RLS)** policies sur la table `User` autorisent le trigger (elles le font généralement car `SECURITY DEFINER` bypasse les RLS).

## Prochaines étapes

1. Après la mise en place du trigger, supprime les utilisateurs de test créés (pour éviter les conflits) :
   ```sql
   DELETE FROM "User" WHERE email = 'owner@demo.local' OR email = 'tech@demo.local';
   ```

2. Teste le flow complet : signup → confirmation → login → accès aux dashboards.

3. Modifie les rôles des utilisateurs via l'éditeur SQL si besoin :
   ```sql
   UPDATE "User" SET role = 'super_admin' WHERE email = 'test@example.com';
   ```

