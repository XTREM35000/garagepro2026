export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "fra1";

import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET() {
  let superAdminExists = false;
  let tenantAdminExists = false;

  try {
    // Use Prisma to check role existence (roles are stored in our User table)
    const superAdmin = await prisma.user.findFirst({ where: { role: UserRole.SUPER_ADMIN } });
    const tenantAdmin = await prisma.user.findFirst({ where: { role: UserRole.TENANT_ADMIN } });
    superAdminExists = !!superAdmin;
    tenantAdminExists = !!tenantAdmin;
  } catch (err: any) {
    console.error('Unexpected error in /api/setup/status:', err?.message ?? err);
  }

  return NextResponse.json({ superAdminExists, tenantAdminExists }, { status: 200 });
}
