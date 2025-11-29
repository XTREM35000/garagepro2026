-- Convert all TEXT IDs to UUID for consistency
-- This is done in a separate migration before the garage schema migration

-- Note: Tenant.id and User.id are currently TEXT, need to convert to UUID
-- However, since they're already being used as foreign keys in many tables,
-- we need to be careful with the conversion

-- For now, we'll just ensure the Client table uses UUID properly by matching existing ID types
-- The Tenant and User IDs will be UUID once Supabase auth integration is updated

-- This migration is a placeholder for future UUID conversion work
-- Actual ID types in the database will be determined by Supabase auth system
