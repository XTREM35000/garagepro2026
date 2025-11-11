-- CreateEnum
-- CreateEnum (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = lower('UserRole')) THEN
        CREATE TYPE "UserRole" AS ENUM ('super_admin', 'admin', 'agent_photo', 'caissier', 'comptable', 'comptable_instance', 'technicien', 'viewer');
    END IF;
END
$$;

-- CreateEnum
-- CreateEnum (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = lower('VehicleStatus')) THEN
        CREATE TYPE "VehicleStatus" AS ENUM ('EN_COURS', 'TERMINE', 'LIVRE');
    END IF;
END
$$;

-- CreateEnum
-- CreateEnum (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = lower('VehiclePhotoType')) THEN
        CREATE TYPE "VehiclePhotoType" AS ENUM ('ENTREE', 'SORTIE', 'DEGAT');
    END IF;
END
$$;

-- CreateEnum
-- CreateEnum (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = lower('CashType')) THEN
        CREATE TYPE "CashType" AS ENUM ('ENTREE', 'SORTIE');
    END IF;
END
$$;

-- CreateEnum
-- CreateEnum (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = lower('InvoiceStatus')) THEN
        CREATE TYPE "InvoiceStatus" AS ENUM ('BROUILLON', 'PAYEE', 'ANNULEE');
    END IF;
END
$$;

-- CreateEnum
-- CreateEnum (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE lower(typname) = lower('SubscriptionStatus')) THEN
        CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRE', 'EN_ATTENTE');
    END IF;
END
$$;

-- CreateTable
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "logoUrl" TEXT,
    "rccm" TEXT,
    "plan" TEXT,
    "stripeId" TEXT,
    "trialEnds" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'viewer',
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "Vehicle" (
    "id" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "immatricule" TEXT NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'EN_COURS',
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "VehiclePhoto" (
    "id" TEXT NOT NULL,
    "type" "VehiclePhotoType" NOT NULL,
    "url" TEXT NOT NULL,
    "takenById" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehiclePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "StockItem" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixAchat" DECIMAL(65,30) NOT NULL,
    "prixVente" DECIMAL(65,30) NOT NULL,
    "seuilAlerte" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "CashRegister" (
    "id" TEXT NOT NULL,
    "montant" DECIMAL(65,30) NOT NULL,
    "type" "CashType" NOT NULL,
    "motif" TEXT NOT NULL,
    "faitParId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "Invoice" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "statut" "InvoiceStatus" NOT NULL,
    "vehicleId" TEXT,
    "clientNom" TEXT NOT NULL,
    "clientTel" TEXT,
    "createdById" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTablea
-- CreateTable (safe)
CREATE TABLE IF NOT EXISTS "Expense" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "montant" DECIMAL(65,30) NOT NULL,
    "categorie" TEXT NOT NULL,
    "faitParId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
-- CreateIndex (safe)
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_stripeId_key" ON "Tenant"("stripeId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Tenant_stripeId_idx" ON "Tenant"("stripeId");

-- CreateIndex
-- CreateIndex (safe)
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "User_tenantId_idx" ON "User"("tenantId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- CreateIndex
-- CreateIndex (safe)
CREATE UNIQUE INDEX IF NOT EXISTS "Vehicle_immatricule_key" ON "Vehicle"("immatricule");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Vehicle_tenantId_idx" ON "Vehicle"("tenantId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Vehicle_status_idx" ON "Vehicle"("status");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "VehiclePhoto_vehicleId_idx" ON "VehiclePhoto"("vehicleId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "VehiclePhoto_takenById_idx" ON "VehiclePhoto"("takenById");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "StockItem_tenantId_idx" ON "StockItem"("tenantId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "StockItem_categorie_idx" ON "StockItem"("categorie");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "CashRegister_tenantId_idx" ON "CashRegister"("tenantId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "CashRegister_faitParId_idx" ON "CashRegister"("faitParId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "CashRegister_type_idx" ON "CashRegister"("type");

-- CreateIndex
-- CreateIndex (safe)
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_numero_key" ON "Invoice"("numero");

-- CreateIndex
-- CreateIndex (safe)
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_vehicleId_key" ON "Invoice"("vehicleId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Invoice_tenantId_idx" ON "Invoice"("tenantId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Invoice_vehicleId_idx" ON "Invoice"("vehicleId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Invoice_statut_idx" ON "Invoice"("statut");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Subscription_tenantId_idx" ON "Subscription"("tenantId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Expense_tenantId_idx" ON "Expense"("tenantId");

-- CreateIndex
-- CreateIndex (safe)
CREATE INDEX IF NOT EXISTS "Expense_faitParId_idx" ON "Expense"("faitParId");

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_tenantId_fkey') THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Vehicle_tenantId_fkey') THEN
        ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'VehiclePhoto_takenById_fkey') THEN
        ALTER TABLE "VehiclePhoto" ADD CONSTRAINT "VehiclePhoto_takenById_fkey" FOREIGN KEY ("takenById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'VehiclePhoto_vehicleId_fkey') THEN
        ALTER TABLE "VehiclePhoto" ADD CONSTRAINT "VehiclePhoto_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'StockItem_tenantId_fkey') THEN
        ALTER TABLE "StockItem" ADD CONSTRAINT "StockItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CashRegister_faitParId_fkey') THEN
        ALTER TABLE "CashRegister" ADD CONSTRAINT "CashRegister_faitParId_fkey" FOREIGN KEY ("faitParId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'CashRegister_tenantId_fkey') THEN
        ALTER TABLE "CashRegister" ADD CONSTRAINT "CashRegister_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invoice_createdById_fkey') THEN
        ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invoice_vehicleId_fkey') THEN
        ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Invoice_tenantId_fkey') THEN
        ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Subscription_tenantId_fkey') THEN
        ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Expense_faitParId_fkey') THEN
        ALTER TABLE "Expense" ADD CONSTRAINT "Expense_faitParId_fkey" FOREIGN KEY ("faitParId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey
-- AddForeignKey (safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Expense_tenantId_fkey') THEN
        ALTER TABLE "Expense" ADD CONSTRAINT "Expense_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;
