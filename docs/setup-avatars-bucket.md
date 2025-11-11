# Configuration du bucket Supabase pour les avatars

## 📋 Prérequis
- Projet Supabase créé
- Dashboard Supabase accessible

## 🪣 Créer le bucket `avatars`

### Option A : Via le Dashboard (recommandé pour démarrer)

1. **Ouvrir le Dashboard Supabase**
   - Aller sur https://app.supabase.com
   - Sélectionner votre projet

2. **Créer le bucket**
   - Menu gauche → Storage
   - Bouton "New bucket"
   - Nommer : `avatars`
   - Cocher ✓ "Public bucket" (les avatars doivent être publiquement lisibles)
   - Cliquer "Create bucket"

3. **Vérifier les permissions (RLS policies)**
   - Sélectionner le bucket `avatars`
   - Onglet "Policies"
   - Si vide ou besoin d'accès limité, voir section RLS ci-dessous

### Option B : Via CLI Supabase

```bash
# Connexion
npx supabase login

# Créer le bucket public
npx supabase storage bucket create avatars --public
```

---

## 🔐 Policies RLS optionnelles (pour plus de contrôle)

Si vous avez besoin que seuls les utilisateurs authentifiés puissent uploader, et que les avatars soient toujours publics :

### Via Dashboard SQL Editor

```sql
-- Permettre aux utilisateurs authentifiés d'uploader des avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid() IS NOT NULL
);

-- Rendre les avatars publiquement lisibles
CREATE POLICY "Avatars are publicly readable" ON storage.objects
FOR SELECT 
USING (bucket_id = 'avatars');
```

### Via Supabase SQL Editor

1. Dashboard → SQL Editor → New Query
2. Coller les SQL ci-dessus
3. Run (play button)

---

## ✅ Vérification

Après création du bucket, vérifier que l'upload d'avatar fonctionne :

1. Aller sur http://localhost:3000/auth
2. Onglet "Inscription"
3. Remplir les champs
4. Cliquer "Choisir" pour sélectionner une image
5. L'upload devrait se faire et afficher l'avatar en preview

### Troubleshooting

| Erreur | Cause | Solution |
|--------|-------|----------|
| "Bucket not found" | Bucket n'existe pas | Créer le bucket via Dashboard ou CLI |
| "No bucket access" | Policies RLS restrictives | Vérifier les policies ou rendre le bucket public |
| Upload échoue silencieusement | Avatar optionnel | C'est normal — l'inscription continue sans avatar |

---

## 💡 Notes de sécurité

- **Public bucket** : Les avatars sont lisibles par tous. C'est intentionnel pour les UX fluides.
- **Private bucket + signed URLs** : Si vous préférez des avatars privés, créer le bucket en privé et utiliser des signed URLs (24h) côté serveur.
- **Max file size** : L'API accepte jusqu'à 5 MB. Adapter `MAX_BYTES` dans `/api/upload/avatar/route.ts` si besoin.

