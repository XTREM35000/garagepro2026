# Contourner la Confirmation d'Email avec Supabase Auth

## Vue d'ensemble

Ce guide explique comment implémenter une authentification sans vérification d'email en utilisant Supabase Auth avec une variable d'environnement configurable.

## Architecture

### 1. Variable d'Environnement

Définissez la variable de contrôle dans `.env` (local) et Vercel :

```env
# Bypass email confirmation (set to 'true' to auto-confirm users)
SUPABASE_BYPASS_EMAIL_CONFIRM=true
```

### 2. Utilisation dans les Routes API

Utilisez `email_confirm: true` lors de la création d'utilisateur dans `auth.users` :

```typescript
// Dans src/app/api/auth/signup/route.ts (ou setup/super-admin, setup/tenant-admin)

const bypassConfirm = process.env.SUPABASE_BYPASS_EMAIL_CONFIRM === 'true'

const createUserPayload: any = {
  email,
  password,
  user_metadata: {
    name: firstName,
    avatarUrl: avatarUrl ?? null
  }
}

// Ajouter email_confirm si la variable d'env est activée
if (bypassConfirm) {
  createUserPayload.email_confirm = true
}

const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser(createUserPayload)
```

## Flux Complet : Signup sans Confirmation d'Email

### Étape 1 : Créer l'Utilisateur dans `auth.users`

```typescript
// 1. Créer dans auth.users avec email_confirm=true
const createUserPayload = {
  email,
  password,
  email_confirm: true,  // ← Clé : auto-confirme l'email
  user_metadata: { name, avatarUrl }
}

const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser(createUserPayload)

if (authErr) throw authErr

const authUserId = authUser.user.id
```

### Étape 2 : Créer l'Utilisateur dans la Table `User`

```typescript
// 2. Créer dans la table User avec timestamps
const now = new Date().toISOString()

const { data: createdUsers, error: createUserErr } = await supabaseAdmin
  .from('User')
  .insert({
    id: authUserId,           // UUID depuis auth.users
    email,
    password: hashPassword(password),  // Hash stocké localement (optionnel)
    name,
    avatarUrl,
    role: 'VIEWER',
    tenantId,
    createdAt: now,
    updatedAt: now
  })
  .select()
  .limit(1)

if (createUserErr) throw createUserErr
```

### Étape 3 : Connexion Automatique depuis le Client

```typescript
// Dans src/components/auth/signup-form.tsx

const onSubmit = async (e) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password, avatarUrl })
  })

  if (res.ok) {
    // L'utilisateur est créé ET auto-confirmé
    // Effectuer la connexion automatique
    await auth.signIn(email, password)
    
    // Redirection vers dashboard
    router.push('/dashboard/agents')
  }
}
```

## Points Clés

### ✅ Ce qui fonctionne

| Action | Résultat |
|--------|----------|
| `email_confirm: true` | Utilisateur confirmé automatiquement (pas d'email) |
| `signIn()` après création | Session établie sans vérifier l'email |
| Redirect dashboard | Accès immédiat au tableau de bord |

### ⚠️ Considérations Importantes

1. **Clé Service Role Requise** : Utilisez `supabaseAdmin` (service_role key), pas le client anon
2. **Variables d'Env en Production** : Configurez `SUPABASE_BYPASS_EMAIL_CONFIRM=true` dans Vercel
3. **Hash de Mot de Passe** : Stocker `scryptSync()` hash en base de données (distinct de Supabase Auth)
4. **Timestamps Explicites** : Postgres nécessite `createdAt` et `updatedAt` explicites (pas d'auto-defaults via API)

## Configuration Vercel

1. Allez sur **Settings** → **Environment Variables**
2. Ajoutez :
   ```
   SUPABASE_BYPASS_EMAIL_CONFIRM=true
   SUPABASE_SERVICE_ROLE_KEY=<votre-clé-service-role>
   ```
3. Redéployez l'application

## Vérification Locale

```bash
# Lancer le serveur dev
npm run dev

# Tester l'endpoint signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "avatarUrl": null
  }'
```

Réponse attendue :
```json
{
  "ok": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "VIEWER",
    "tenantId": "..."
  },
  "autoLogin": true
}
```

## Dépannage

### Erreur : "email not confirmed"

**Cause** : `email_confirm: true` n'a pas été passé
```typescript
// ❌ Incorrect
const payload = { email, password }

// ✅ Correct
const payload = { email, password, email_confirm: true }
```

### Erreur : "Supabase admin client not configured"

**Cause** : `SUPABASE_SERVICE_ROLE_KEY` manquante
- Vérifiez `.env.local` (dev) ou Vercel Settings (production)
- Service role key commence par `eyJhbGc...` et contient `service_role`

### Erreur : "null value in column 'updatedAt'"

**Cause** : Timestamps manquants à l'insertion
```typescript
// ✅ Toujours inclure les timestamps
const now = new Date().toISOString()
await supabaseAdmin.from('User').insert({
  // ... autres champs
  createdAt: now,
  updatedAt: now
})
```

## Résumé des 3 Routes Impactées

| Route | Usage | Email Confirm |
|-------|-------|---------------|
| `/api/setup/super-admin` | Créer admin platform | Configurable (env var) |
| `/api/setup/tenant-admin` | Créer admin tenant | Configurable (env var) |
| `/api/auth/signup` | Inscription utilisateur | Configurable (env var) |

Toutes trois utilisent la même logique :
```typescript
if (process.env.SUPABASE_BYPASS_EMAIL_CONFIRM === 'true') {
  createUserPayload.email_confirm = true
}
```

---

**Documentation mise à jour le** : 26 novembre 2025
