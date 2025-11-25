export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET() {
  let superAdminExists = false;
  let tenantAdminExists = false;
  let debugInfo = {};

  try {
    // Debug: Afficher les infos de connexion
    debugInfo = {
      databaseUrl: process.env.DATABASE_URL?.substring(0, 80) + '...',
      usesNewProject: process.env.DATABASE_URL?.includes('mgnukermjfidhmpyrxyl'),
      usesOldProject: process.env.DATABASE_URL?.includes('tpbfszuvltclkdsjxrgw'),
      timestamp: new Date().toISOString()
    };

    console.log('Debug setup/status:', debugInfo);

    // Test de connexion simple d'abord
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connexion DB OK');

    // Use Prisma to check role existence
    const superAdmin = await prisma.user.findFirst({ where: { role: UserRole.SUPER_ADMIN } });
    const tenantAdmin = await prisma.user.findFirst({ where: { role: UserRole.TENANT_ADMIN } });

    superAdminExists = !!superAdmin;
    tenantAdminExists = !!tenantAdmin;

    console.log('✅ Setup check OK:', { superAdminExists, tenantAdminExists });

  } catch (err: any) {
    console.error('❌ Error in /api/setup/status:', err?.message ?? err);
    console.error('Debug info:', debugInfo);

    // Retourner les infos de debug en cas d'erreur
    return NextResponse.json({
      superAdminExists,
      tenantAdminExists,
      error: err.message,
      debug: debugInfo
    }, { status: 200 }); // Toujours 200 pour ne pas casser le frontend
  }

  return NextResponse.json({ superAdminExists, tenantAdminExists }, { status: 200 });
}