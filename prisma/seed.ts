
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase env vars manquantes')
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  // Vérifier si un super_admin existe déjà
  const existingAdmin = await prisma.user.findFirst({ where: { role: 'super_admin' } })
  if (existingAdmin) {
    console.log('Super admin déjà présent:', existingAdmin.id)
    return
  }

  // Créer organisation/tenant si absent
  let tenant = await prisma.tenant.findFirst()
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: 'Demo Garage' } })
    console.log('Tenant créé:', tenant.id)
  }

  // Créer user dans Supabase Auth
  const email = 'admin@demo.local'
  const password = 'DemoAdmin2025!'
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { first_name: 'Super', last_name: 'Admin' },
    email_confirm: true,
  })
  if (error || !data?.user?.id) {
    throw new Error('Erreur création user Supabase: ' + (error?.message || ''))
  }
  const userId = data.user.id

  // Créer profil dans Prisma
  await prisma.user.create({
    data: {
      id: userId,
      name: 'Super Admin',
      avatarUrl: null,
      role: 'super_admin',
      tenantId: tenant.id,
    },
  })
  console.log('Super admin seedé:', userId)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })