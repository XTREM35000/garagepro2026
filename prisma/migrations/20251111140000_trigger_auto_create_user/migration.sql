-- Trigger: auto-create User record when auth.users is created
-- This ensures that every new Supabase Auth signup also creates a row in the User table

-- Create or replace the function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User" (
    "id",
    "email",
    "name",
    "role",
    "tenantId",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    new.id,
    new.email,
    COALESCE((new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name'), new.email),
    'viewer',
    COALESCE(new.raw_user_meta_data->>'tenant_id', 'demo'),
    now(),
    now()
  )
  ON CONFLICT ("id") DO UPDATE
  SET
    "email" = new.email,
    "name" = COALESCE((new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name'), new.email),
    "updatedAt" = now()
  WHERE "User"."id" = new.id;

  RETURN new;
END;
$$;

-- Create the trigger on auth.users (Supabase auth table)
-- Drop if exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
