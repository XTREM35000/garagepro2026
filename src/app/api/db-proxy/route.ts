import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Cette route s'exécute SUR Vercel, donc peut accéder à Supabase
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    await prisma.$connect();
    const result = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version() as version`;
    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Proxy connection WORKING!',
      version: result[0].version,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}