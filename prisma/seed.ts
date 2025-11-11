import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Création de l'organisation par défaut (super admin)
  const org = await prisma.organisation.upsert({
    where: { tenant_id: 'super_admin_org' },
    update: {},
    create: {
      name: 'Super Admin Organisation',
      tenant_id: 'super_admin_org',
      settings: {
        create: {
          company_name: 'SaaS Manager Admin',
          slogan: 'Administration système',
          theme: 'light',
        },
      },
    },
  })

  // Création du super admin
  await prisma.user.upsert({
    where: { email: '2024dibo@gmail.com' },
    update: {
      role: UserRole.super_admin,
      organisation_id: org.id,
    },
    create: {
      email: '2024dibo@gmail.com',
      role: UserRole.super_admin,
      name: 'Super Admin',
      organisation_id: org.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })