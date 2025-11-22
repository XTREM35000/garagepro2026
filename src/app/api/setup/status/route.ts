export const runtime = "nodejs";

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // Vérifie s'il existe un super_admin et un admin/tenant
  const superAdminExists = await prisma.user.findFirst({ where: { role: 'super_admin' } })
  const tenantAdminExists = await prisma.user.findFirst({ where: { role: 'admin' } })
  return NextResponse.json({
    superAdminExists: !!superAdminExists,
    tenantAdminExists: !!tenantAdminExists,
  })
}
