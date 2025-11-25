export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET() {
  let superAdminExists = false;
  let tenantAdminExists = false;
  let dbConnected = false;

  try {
    // Test de connexion basique d'abord
    await prisma.$queryRaw`SELECT 1 as connection_test`;
    dbConnected = true;

    // Vérifier l'existence des utilisateurs
    const superAdmin = await prisma.user.findFirst({
      where: { role: UserRole.SUPER_ADMIN }
    });
    const tenantAdmin = await prisma.user.findFirst({
      where: { role: UserRole.TENANT_ADMIN }
    });

    superAdminExists = !!superAdmin;
    tenantAdminExists = !!tenantAdmin;

  } catch (err: any) {
    console.error('Error in /api/setup/status:', err.message);

    // Retourner l'état même en cas d'erreur
    return NextResponse.json({
      superAdminExists,
      tenantAdminExists,
      dbConnected,
      error: "Database connection issue",
      needsSetup: true
    }, { status: 200 });
  }

  return NextResponse.json({
    superAdminExists,
    tenantAdminExists,
    dbConnected,
    needsSetup: !superAdminExists
  }, { status: 200 });
}