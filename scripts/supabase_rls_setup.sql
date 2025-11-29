-- Supabase RLS and grants helper
-- Run this in the Supabase SQL editor as a super-admin (or platform SQL runner).

-- Ensure service_role can access the public schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO "service_role";

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "service_role";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "service_role";
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO "service_role";

-- Example RLS policies for core tables (adjust to your needs):

-- Users: allow authenticated users to select their own row; allow service_role full access
ALTER TABLE IF EXISTS public."User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access to User" ON public."User"
  FOR ALL
  USING ( current_setting('request.jwt.claims.role', true) = 'service_role' )
  WITH CHECK ( current_setting('request.jwt.claims.role', true) = 'service_role' );

CREATE POLICY "Allow user access to their own profile" ON public."User"
  FOR SELECT
  USING ( auth.uid() = id );

CREATE POLICY "Allow authenticated insert for own user (signup)" ON public."User"
  FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Tenants: only service_role and platform admins may manage
ALTER TABLE IF EXISTS public."Tenant" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access Tenant" ON public."Tenant"
  FOR ALL
+ USING ( current_setting('request.jwt.claims.role', true) = 'service_role' )
+ WITH CHECK ( current_setting('request.jwt.claims.role', true) = 'service_role' );

-- Receptions example: allow authenticated users of the tenant to see
ALTER TABLE IF EXISTS public."Reception" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access Reception" ON public."Reception"
  FOR ALL
  USING ( current_setting('request.jwt.claims.role', true) = 'service_role' )
  WITH CHECK ( current_setting('request.jwt.claims.role', true) = 'service_role' );

-- Fallback: allow SELECT for authenticated users for rows that match tenant
CREATE POLICY "Allow tenant members to select Receptions" ON public."Reception"
  FOR SELECT
  USING ( exists (select 1 from public."User" u where u.id = auth.uid() and u.tenantId = "Reception"."tenantId") );

-- Important: tailor and secure policies for your exact access model.
-- After applying, refresh policies and test endpoints with service role key.
