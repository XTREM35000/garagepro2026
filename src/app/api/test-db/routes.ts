import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export default async function handler(req: NextRequest) {
  try {
    const tenants = await prisma.tenant.findMany();
    return NextResponse.json({ tenants }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
