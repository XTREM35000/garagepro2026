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
    const { tenantName, firstName, lastName, email, password, avatarUrl } = body;

    if (!tenantName || !firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // create tenant (if duplicate name exists, return error)
    const existingTenant = await prisma.tenant.findFirst({ where: { name: tenantName } as any } as any);
    if (existingTenant) {
      return NextResponse.json({ error: "Tenant already exists" }, { status: 400 });
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        plan: "basic",
      }
    });

    const hashed = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: `${firstName} ${lastName}`,
        avatarUrl,
        role: ('TENANT_ADMIN' as any),
        tenantId: tenant.id
      } as any,
    } as any) as any;

    return NextResponse.json({ ok: true, tenant, admin: user }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
