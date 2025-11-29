-- Add Reception workflow tables
-- IDs as TEXT to match Supabase UUID-as-text storage

-- Alter Client: add business fields
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "typeClient" VARCHAR DEFAULT 'PARTICULIER';
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "numeroPermis" VARCHAR;
ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "preferences" JSONB;

-- Create Reception table
CREATE TABLE IF NOT EXISTS "Reception" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "numeroBT" VARCHAR UNIQUE NOT NULL,
  "dateReception" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "clientId" TEXT NOT NULL,
  "vehicleId" TEXT NOT NULL,
  "receptionnisteId" TEXT NOT NULL,
  "motifVisite" TEXT NOT NULL,
  urgence VARCHAR NOT NULL,
  observations TEXT,
  statut VARCHAR NOT NULL DEFAULT 'EN_COURS',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("clientId") REFERENCES "Client"(id) ON DELETE RESTRICT,
  FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"(id) ON DELETE RESTRICT,
  FOREIGN KEY ("receptionnisteId") REFERENCES "User"(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "Reception_clientId_idx" ON "Reception"("clientId");
CREATE INDEX IF NOT EXISTS "Reception_vehicleId_idx" ON "Reception"("vehicleId");
CREATE INDEX IF NOT EXISTS "Reception_receptionnisteId_idx" ON "Reception"("receptionnisteId");

-- Create VehicleInspection table
CREATE TABLE IF NOT EXISTS "VehicleInspection" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "receptionId" TEXT UNIQUE NOT NULL,
  kilometrage INTEGER NOT NULL,
  "niveauCarburant" VARCHAR NOT NULL,
  "presenceOutils" BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("receptionId") REFERENCES "Reception"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "VehicleInspection_receptionId_idx" ON "VehicleInspection"("receptionId");

-- Create InspectionPhoto table
CREATE TABLE IF NOT EXISTS "InspectionPhoto" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "inspectionId" TEXT NOT NULL,
  type VARCHAR NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("inspectionId") REFERENCES "VehicleInspection"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "InspectionPhoto_inspectionId_idx" ON "InspectionPhoto"("inspectionId");

-- Create Damage table
CREATE TABLE IF NOT EXISTS "Damage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "inspectionId" TEXT NOT NULL,
  localisation TEXT NOT NULL,
  type VARCHAR NOT NULL,
  gravite VARCHAR NOT NULL,
  photo TEXT NOT NULL,
  notes TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("inspectionId") REFERENCES "VehicleInspection"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Damage_inspectionId_idx" ON "Damage"("inspectionId");
