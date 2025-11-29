-- Make User.tenantId optional (allow NULL for Super Admins)
ALTER TABLE "User" 
ALTER COLUMN "tenantId" DROP NOT NULL;

-- Add superAdminId column to Tenant (TEXT to match User.id which is text)
ALTER TABLE "Tenant"
ADD COLUMN "superAdminId" TEXT;

-- Add foreign key constraint from Tenant.superAdminId to User.id
ALTER TABLE "Tenant"
ADD CONSTRAINT "Tenant_superAdminId_fkey" 
FOREIGN KEY ("superAdminId") REFERENCES "User"("id") ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX "Tenant_superAdminId_idx" ON "Tenant"("superAdminId");
