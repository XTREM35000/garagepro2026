-- Exemple de policies RLS multi-tenant pour public."User"
-- À adapter pour chaque table métier (Vehicle, Invoice, etc.)

-- Activer RLS sur la table User
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Policy : chaque utilisateur ne peut voir que les users de son tenant
CREATE POLICY "user_tenant_select" ON public."User"
  FOR SELECT
  USING (tenantId = current_setting('app.current_tenant')::uuid);

-- Policy : chaque utilisateur ne peut insérer que pour son tenant
CREATE POLICY "user_tenant_insert" ON public."User"
  FOR INSERT
  WITH CHECK (tenantId = current_setting('app.current_tenant')::uuid);

-- Policy : chaque utilisateur ne peut mettre à jour que ses users du tenant
CREATE POLICY "user_tenant_update" ON public."User"
  FOR UPDATE
  USING (tenantId = current_setting('app.current_tenant')::uuid);
  WITH CHECK (tenantId = current_setting('app.current_tenant')::uuid);

-- Policy : chaque utilisateur ne peut supprimer que ses users du tenant
CREATE POLICY "user_tenant_delete" ON public."User"
  FOR DELETE
  USING (tenantId = current_setting('app.current_tenant')::uuid);

-- À répéter pour chaque table métier : Vehicle, Invoice, etc.
-- Exemple pour Vehicle :
-- ALTER TABLE public."Vehicle" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "vehicle_tenant_select" ON public."Vehicle"
--   FOR SELECT USING (tenantId = current_setting('app.current_tenant')::uuid);
