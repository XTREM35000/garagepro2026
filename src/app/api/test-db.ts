// app/api/tenants/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🟡 Début de GET /api/tenants');

  try {
    console.log('🟡 Avant ');
    console.log('🟡 Avant prisma.tenant.findMany()');
    const tenants = await prisma.tenant.findMany();
    console.log('🟡 Après prisma.tenant.findMany(), count:', tenants.length);

    return NextResponse.json({
      success: true,
      tenants,
      count: tenants.length
    }, { status: 200 });

  } catch (err: any) {
    console.error('🔴 Erreur détaillée dans /api/tenants:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Stack:', err.stack);

    return NextResponse.json({
      success: false,
      error: err.message,
      code: err.code
    }, { status: 500 });
  }
}