-- Trigger: auto-create User record when auth.users is created
-- Updated for profile-only User schema (no email/password stored in app DB)
-- Fixed: id columns are TEXT (not UUID), so use 'demo' tenant or first available

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
