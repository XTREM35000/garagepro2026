// Archive of original prisma/seed.ts
// Moved here by automated refactor on 2025-11-24 because deletion in the workspace failed.
// Original seed content kept for reference. Remove this file when you no longer need it.

import { PrismaClient, UserRole, VehicleStatus, InvoiceStatus, SubscriptionStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // Création du tenant
  let tenant = await prisma.tenant.findFirst({ where: { name: 'Garage Principal' } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        id: randomUUID(),
        name: 'Garage Principal',
        address: 'Abidjan, Côte d\'Ivoire',
        plan: 'basic',
      },
    });
  }
  console.log('Tenant créé:', tenant.id);

  // Création des utilisateurs
  const userNames = [
    'Kouassi Yao', 'Ouattara Evelyne', 'Traoré Bamba',
    'Koné Mariam', 'N\'Guessan Abou', 'Soro Adama',
    'Gnakpa Aya', 'Diabaté Koffi'
  ];

  const users = [];
  for (const name of userNames) {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name,
        role: UserRole.viewer,
        tenantId: tenant.id,
      },
    });
    users.push(user);
  }
  console.log('Users créés:', users.map(u => u.name).join(', '));

  // Création des véhicules
  const vehicles = [];
  for (let i = 0; i < 60; i++) {
    const vehicle = await prisma.vehicle.create({
      data: {
        id: randomUUID(),
        marque: `Marque ${i + 1}`,
        modele: `Modèle ${i + 1}`,
        immatricule: `CI-1234-${i + 1}`,
        status: VehicleStatus.EN_COURS,
        tenantId: tenant.id,
      },
    });
    vehicles.push(vehicle);
  }
  console.log('Véhicules créés:', vehicles.length);

  // Création des factures
  let invIndex = 1;
  for (const vehicle of vehicles) {
    const createdBy = randFrom(users);
    await prisma.invoice.create({
      data: {
        id: randomUUID(),
        numero: `INV-2025-${String(invIndex).padStart(4, '0')}`,
        total: Math.floor(Math.random() * 500000) + 50000,
        statut: InvoiceStatus.BROUILLON,
        vehicleId: vehicle.id,
        clientNom: `Client ${invIndex}`,
        clientTel: `225700000${String(invIndex).padStart(2, '0')}`,
        tenantId: tenant.id,
        createdById: createdBy.id,
      },
    });
    invIndex++;
  }
  console.log('Factures créées:', vehicles.length);

  // Création des abonnements
  const subscription = await prisma.subscription.create({
    data: {
      id: randomUUID(),
      plan: 'basic',
      status: SubscriptionStatus.ACTIVE,
      stripeCustomerId: randomUUID(),
      stripeSubscriptionId: randomUUID(),
      tenantId: tenant.id,
    },
  });
  console.log('Abonnement créé:', subscription.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
