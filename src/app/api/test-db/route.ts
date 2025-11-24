import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/test-db
export async function GET(req: NextRequest) {
  try {
    const tenants = await prisma.tenant.findMany();
    return NextResponse.json({ tenants }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
