-- AlterTable Tenant: Add garage business info
ALTER TABLE "Tenant" ADD COLUMN phone VARCHAR,
ADD COLUMN email VARCHAR,
ADD COLUMN website VARCHAR,
ADD COLUMN "businessHours" VARCHAR;

-- Create index for tenant search
CREATE INDEX "Tenant_name_idx" ON "Tenant"(name);

-- AlterTable User: Add garage team info
ALTER TABLE "User" ADD COLUMN phone VARCHAR,
ADD COLUMN specialty VARCHAR,
ADD COLUMN "hireDate" TIMESTAMP(3),
ADD COLUMN status VARCHAR DEFAULT 'ACTIVE';

-- Create indexes for user filtering
CREATE INDEX "User_status_idx" ON "User"(status);
CREATE INDEX "User_specialty_idx" ON "User"(specialty);

-- AlterTable Vehicle: Add detailed vehicle info
ALTER TABLE "Vehicle" ADD COLUMN annee INTEGER,
ADD COLUMN couleur VARCHAR,
ADD COLUMN kilometrage INTEGER,
ADD COLUMN carburant VARCHAR,
ADD COLUMN chassis VARCHAR,
ADD COLUMN "clientId" TEXT;

-- Create index for vehicle search
CREATE INDEX "Vehicle_marque_idx" ON "Vehicle"(marque);
CREATE INDEX "Vehicle_clientId_idx" ON "Vehicle"("clientId");

-- Create Client table
CREATE TABLE "Client" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nom VARCHAR NOT NULL,
  prenom VARCHAR,
  email VARCHAR,
  telephone VARCHAR,
  adresse VARCHAR,
  "tenantId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"(id) ON DELETE CASCADE
);

-- Create indexes for Client
CREATE INDEX "Client_tenantId_idx" ON "Client"("tenantId");
CREATE INDEX "Client_nom_idx" ON "Client"(nom);
CREATE INDEX "Client_telephone_idx" ON "Client"(telephone);
CREATE UNIQUE INDEX "Client_tenantId_email_key" ON "Client"("tenantId", email);

-- AlterTable Invoice: Replace clientNom/clientTel with clientId
ALTER TABLE "Invoice" DROP COLUMN IF EXISTS "clientNom",
DROP COLUMN IF EXISTS "clientTel",
ADD COLUMN "clientId" TEXT;

-- Create foreign key for Invoice -> Client
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"(id) ON DELETE SET NULL;

-- Create index for invoice-client join
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");

-- Add foreign key for Vehicle -> Client
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_clientId_fkey"
  FOREIGN KEY ("clientId") REFERENCES "Client"(id) ON DELETE SET NULL;
