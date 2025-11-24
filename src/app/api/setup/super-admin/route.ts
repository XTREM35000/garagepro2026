// Next.js App Router - POST
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from 'crypto'

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(password, salt, 64)
  return `${salt}:${derived.toString('hex')}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, avatarUrl } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // find platform tenant (should exist via SQL but if not create)
    let platform = await prisma.tenant.findFirst({ where: { isPlatform: true } as any } as any);
    if (!platform) {
      platform = await prisma.tenant.create({
        data: {
          name: "PLATFORM",
          plan: "platform",
          isPlatform: true
        }
      } as any) as any;
    }

    // ensure platform has an id before using it (TS strict null check)
    const tenantId = (platform as any)?.id
    if (!tenantId) {
      console.error('Platform tenant created but missing id', platform)
      return NextResponse.json({ error: 'Platform tenant error' }, { status: 500 })
    }

    // check existing super admin with same email
    const existing = await prisma.user.findFirst({ where: { email } as any } as any);
    if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const hashed = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: `${firstName} ${lastName}`,
        avatarUrl,
        role: ('SUPER_ADMIN' as any),
        tenantId: tenantId
      } as any,
    } as any) as any;

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  } finally {
    // don't call prisma.$disconnect() for serverless — let runtime handle pooling
  }
}
