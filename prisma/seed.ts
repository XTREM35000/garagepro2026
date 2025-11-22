
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function uuid() {
  return crypto.randomUUID()
}

// Helpers
function randFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  // Create or reuse tenant
  let tenant = await prisma.tenant.findFirst()
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Garage Abidjan',
        address: 'Cocody, Abidjan',
        plan: 'premium',
      },
    })
    console.log('Tenant créé:', tenant.id)
  }

  // Create users (roles used in app)
  const usersData = [
    { name: 'Kouassi Yao', role: 'super_admin' },
    { name: 'Ouattara Evelyne', role: 'admin' },
    { name: 'Traoré Bamba', role: 'technicien' },
    { name: 'Koné Mariam', role: 'caissier' },
    { name: 'N\'Guessan Abou', role: 'agent_photo' },
    { name: 'Soro Adama', role: 'comptable' },
    { name: 'Gnakpa Aya', role: 'viewer' },
    { name: 'Diabaté Koffi', role: 'technicien' },
  ]

  const users = [] as any[]
  for (const u of usersData) {
    const id = uuid()
    const created = await prisma.user.create({
      data: {
        id,
        name: u.name,
        role: u.role as any,
        tenantId: tenant.id,
      },
    })
    users.push(created)
  }
  console.log('Users créés:', users.map((u) => u.name).join(', '))

  // Clients (generated, CI names + phones)
  const firstNames = ['Yao', 'Kouadio', 'Koffi', 'Abou', 'Bamba', 'Mariam', 'Adama', 'Ahou', 'Evelyne', 'Aya', 'Fatou', 'Ismaël', 'Amadou', 'Issa', 'Oumar']
  const lastNames = ['Koné', 'Traoré', 'Ouattara', 'N\'Guessan', 'Diabaté', 'Soro', 'Gnakpa', 'Kouassi', 'Diarra', 'Coulibaly', 'Diallo', 'Keita']
  const abidjanZones = ['Cocody', 'Yopougon', 'Abobo', 'Marcory', 'Treichville', 'Koumassi', 'Plateau', 'Bingerville']

  const clients: Array<{ nom: string; tel: string; adresse: string }> = []
  const phonePrefixes = ['01', '05', '07', '27']
  for (let i = 0; i < 40; i++) {
    const fn = randFrom(firstNames)
    const ln = randFrom(lastNames)
    const nom = `${ln} ${fn}`
    const prefix = randFrom(phonePrefixes)
    const phone = `+225 ${prefix} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)}`
    const adresse = randFrom(abidjanZones)
    clients.push({ nom, tel: phone, adresse })
  }

  // Vehicles
  const marques = [
    ['Toyota', 'Corolla'],
    ['Toyota', 'Hilux'],
    ['Hyundai', 'i10'],
    ['Kia', 'Sportage'],
    ['Nissan', 'X-Trail'],
    ['Renault', 'Clio'],
    ['Mercedes', 'Classe C'],
    ['Kia', 'Picanto'],
    ['Hyundai', 'Tucson'],
  ]

  const platePrefixes = ['GR', 'DK', 'AB', 'BD', 'KT', 'SP', 'MD']

  const vehicles = [] as any[]
  // Create a larger fleet (60 vehicles)
  for (let i = 0; i < 60; i++) {
    const [marque, modele] = randFrom(marques)
    const prefix = randFrom(platePrefixes)
    const num = 1000 + Math.floor(Math.random() * 9000)
    const suffix = randFrom(['AB', 'CD', 'EF', 'GH', 'IJ'])
    const immat = `${prefix}-${num}-${suffix}`
    const created = await prisma.vehicle.create({
      data: {
        marque,
        modele,
        immatricule: immat,
        status: randFrom(['EN_COURS', 'TERMINE', 'LIVRE']),
        tenantId: tenant.id,
      },
    })
    vehicles.push(created)
  }
  console.log('Véhicules créés:', vehicles.length)

  // Vehicle photos (sample)
  const photoTypes = ['ENTREE', 'SORTIE', 'DEGAT'] as any
  // Create many photos
  for (let i = 0; i < 200; i++) {
    const v = randFrom(vehicles)
    const takenBy = randFrom(users)
    await prisma.vehiclePhoto.create({
      data: {
        type: randFrom(photoTypes),
        url: `/images/ci_photo_${(i % 6) + 1}.jpg`,
        takenById: takenBy.id,
        vehicleId: v.id,
      },
    })
  }

  // Stock items
  const stockItems = [
    { nom: 'Huile moteur 5W40 1L', categorie: 'Lubrifiants', quantite: 50, prixAchat: '4500', prixVente: '12000', seuilAlerte: 10 },
    { nom: 'Plaquettes AV', categorie: 'Freinage', quantite: 30, prixAchat: '8000', prixVente: '25000', seuilAlerte: 5 },
    { nom: 'Batterie 12V', categorie: 'Électrique', quantite: 20, prixAchat: '15000', prixVente: '45000', seuilAlerte: 3 },
    { nom: 'Pneu 185/65', categorie: 'Pneumatiques', quantite: 40, prixAchat: '12000', prixVente: '35000', seuilAlerte: 8 },
    { nom: 'Amortisseur AV', categorie: 'Suspension', quantite: 10, prixAchat: '20000', prixVente: '60000', seuilAlerte: 2 },
  ]

  for (const s of stockItems) {
    await prisma.stockItem.create({ data: { ...s, tenantId: tenant.id } })
  }

  // Invoices and payments
  const invoiceTypes = ['VIDANGE', 'FREINAGE', 'DIAGNOSTIC', 'PNEUS', 'ELECTRICITE']
  // Generate many invoices across last 18 months
  function randomDateWithinMonths(months: number) {
    const now = Date.now()
    const past = now - months * 30 * 24 * 60 * 60 * 1000
    const t = past + Math.floor(Math.random() * (now - past))
    return new Date(t)
  }

  let invIndex = 1
  const amountRanges: Record<string, [number, number]> = {
    VIDANGE: [20000, 35000],
    FREINAGE: [40000, 150000],
    DIAGNOSTIC: [10000, 25000],
    PNEUS: [25000, 80000],
    ELECTRICITE: [10000, 80000],
  }

  // Create ~200 invoices
  for (let i = 0; i < 200; i++) {
    const client = randFrom(clients)
    const veh = randFrom(vehicles)
    const type = randFrom(invoiceTypes)
    const [minA, maxA] = amountRanges[type]
    const montant = String(minA + Math.floor(Math.random() * (maxA - minA + 1)))
    const statut = randFrom(['BROUILLON', 'PAYEE', 'ANNULEE'])
    const numero = `INV-2025-${String(invIndex).padStart(4, '0')}`
    invIndex++
    const createdBy = randFrom(users)
    await prisma.invoice.create({
      data: {
        numero,
        total: montant,
        statut: statut as any,
        vehicleId: veh.id,
        clientNom: client.nom,
        clientTel: client.tel,
        createdById: createdBy.id,
        tenantId: tenant.id,
        createdAt: randomDateWithinMonths(18),
      },
    })

    if (statut === 'PAYEE') {
      await prisma.cashRegister.create({
        data: {
          montant: montant,
          type: 'ENTREE',
          motif: `Paiement facture ${numero}`,
          faitParId: createdBy.id,
          tenantId: tenant.id,
          createdAt: randomDateWithinMonths(18),
        },
      })
    }
  }

  // Expenses
  const expenses = [
    { libelle: 'Achat huiles et lubrifiants', montant: '120000', categorie: 'Achat', faitParId: users[2].id },
    { libelle: 'Fournitures atelier', montant: '45000', categorie: 'Fourniture', faitParId: users[1].id },
  ]
  for (const e of expenses) {
    await prisma.expense.create({ data: { ...e, tenantId: tenant.id } })
  }

  console.log('Seed CI terminé ✅')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })