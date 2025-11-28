-- CreateTable Intervention
CREATE TABLE "interventions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "technicianId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "priority" TEXT NOT NULL DEFAULT 'NORMALE',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "diagnosis" TEXT,
    "observations" TEXT,
    "startDate" TIMESTAMP(3),
    "estimatedEndDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "estimatedCost" DECIMAL(10,2),
    "actualCost" DECIMAL(10,2),
    "partsCost" DECIMAL(10,2),
    "laborCost" DECIMAL(10,2),

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable UsedPart
CREATE TABLE "UsedPart" (
    "id" TEXT NOT NULL,
    "interventionId" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsedPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable TimeEntry
CREATE TABLE "TimeEntry" (
    "id" TEXT NOT NULL,
    "interventionId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable InterventionPhoto
CREATE TABLE "InterventionPhoto" (
    "id" TEXT NOT NULL,
    "interventionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterventionPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interventions_tenantId_idx" ON "interventions"("tenantId");

-- CreateIndex
CREATE INDEX "interventions_vehicleId_idx" ON "interventions"("vehicleId");

-- CreateIndex
CREATE INDEX "interventions_technicianId_idx" ON "interventions"("technicianId");

-- CreateIndex
CREATE INDEX "interventions_status_idx" ON "interventions"("status");

-- CreateIndex
CREATE INDEX "UsedPart_interventionId_idx" ON "UsedPart"("interventionId");

-- CreateIndex
CREATE INDEX "TimeEntry_interventionId_idx" ON "TimeEntry"("interventionId");

-- CreateIndex
CREATE INDEX "InterventionPhoto_interventionId_idx" ON "InterventionPhoto"("interventionId");

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedPart" ADD CONSTRAINT "UsedPart_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterventionPhoto" ADD CONSTRAINT "InterventionPhoto_interventionId_fkey" FOREIGN KEY ("interventionId") REFERENCES "interventions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
