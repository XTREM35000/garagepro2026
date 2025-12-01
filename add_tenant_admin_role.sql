-- Add tenant_admin to UserRole enum
ALTER TYPE "UserRole" ADD VALUE 'tenant_admin' BEFORE 'admin';
