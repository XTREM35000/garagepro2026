#!/bin/bash

# Script pour appliquer les policies RLS Supabase
# Remplacer DATABASE_URL par votre URL de base de données

# Policies RLS pour la table organisation
psql $DATABASE_URL -c "
  ALTER TABLE organisation ENABLE ROW LEVEL SECURITY;
  
  -- Super admin peut tout voir/éditer
  CREATE POLICY super_admin_all ON organisation
    FOR ALL
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM users 
      WHERE users.role = 'super_admin'
      AND users.id = auth.uid()
    ));

  -- Users peuvent voir leur organisation
  CREATE POLICY org_select ON organisation
    FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM users 
      WHERE users.organisation_id = organisation.id
      AND users.id = auth.uid()
    ));

  -- Admin peut éditer son organisation
  CREATE POLICY org_update ON organisation
    FOR UPDATE  
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM users
      WHERE users.organisation_id = organisation.id 
      AND users.role = 'admin'
      AND users.id = auth.uid()
    ));
"

# Policies pour users
psql $DATABASE_URL -c "
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;

  -- Super admin peut tout faire
  CREATE POLICY super_admin_all ON users
    FOR ALL
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM users super_admin
      WHERE super_admin.role = 'super_admin'
      AND super_admin.id = auth.uid()
    ));

  -- Admin peut gérer les users de son org
  CREATE POLICY admin_org_users ON users
    FOR ALL
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM users admin
      WHERE admin.role = 'admin'
      AND admin.organisation_id = users.organisation_id
      AND admin.id = auth.uid()
    ));

  -- Users peuvent voir les autres de leur org
  CREATE POLICY org_users_select ON users
    FOR SELECT
    TO authenticated
    USING (organisation_id IN (
      SELECT organisation_id FROM users
      WHERE id = auth.uid()
    ));
"

# Policies pour settings
psql $DATABASE_URL -c "
  ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

  -- Même policies que organisation
  CREATE POLICY settings_super_admin ON settings
    FOR ALL
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM users
      WHERE users.role = 'super_admin'
      AND users.id = auth.uid()
    ));

  CREATE POLICY settings_select ON settings
    FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM users
      WHERE users.organisation_id = settings.organisation_id
      AND users.id = auth.uid()
    ));

  CREATE POLICY settings_update ON settings
    FOR UPDATE
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM users
      WHERE users.organisation_id = settings.organisation_id
      AND users.role = 'admin'
      AND users.id = auth.uid()
    ));
"