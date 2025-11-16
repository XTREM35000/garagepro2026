-- Migration: remove email and password columns from public."User"
-- This migration drops the duplicated auth fields and updates triggers/indexes.

BEGIN;

-- Drop email/password columns from public."User" if they exist
ALTER TABLE public."User" DROP COLUMN IF EXISTS "email";
ALTER TABLE public."User" DROP COLUMN IF EXISTS "password";

-- Drop indexes related to email if present
DROP INDEX IF EXISTS "User_email_key";
DROP INDEX IF EXISTS "User_email_idx";

-- Update trigger function to only set profile fields (no email)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User" (
    "id",
    "name",
    "role",
    "tenantId",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name'), new.id::text),
    'viewer',
    COALESCE(new.raw_user_meta_data->>'tenant_id', 'demo'),
    now(),
    now()
  )
  ON CONFLICT ("id") DO UPDATE
  SET
    "name" = COALESCE((new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name'), new.id::text),
    "updatedAt" = now()
  WHERE public."User"."id" = new.id;

  RETURN new;
END;
$$;

-- Ensure trigger exists on auth.users (recreate safely)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMIT;
