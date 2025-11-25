import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const prisma = new PrismaClient();

    // Test simple
    const result = await prisma.$queryRaw<{ version: string }[]>`SELECT version() as version`;
    const version = result[0].version;

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      database: 'connected',
      version: version,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      databaseUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}