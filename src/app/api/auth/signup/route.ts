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
    const { firstName, lastName, email, password, avatarUrl, tenantId } = body;

    // tenantId optional: if not provided, try to sign up into PLATFORM? prefer tenantId required for normal users
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Check tenant: if tenantId provided use it; otherwise attempt find first non-platform tenant
    let tenant = null as any;
    if (tenantId) {
      tenant = await prisma.tenant.findUnique({ where: { id: tenantId } as any } as any);
      if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    } else {
      // fallback: pick first non-platform tenant
      tenant = await prisma.tenant.findFirst({ where: { isPlatform: false } as any } as any);
      if (!tenant) return NextResponse.json({ error: "No tenant available. Create a tenant first." }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({ where: { email } as any } as any);
    if (existing) return NextResponse.json({ error: "Email already used" }, { status: 400 });

    const hashed = hashPassword(password);

    const user = await prisma.user.create({
      // cast to any to avoid strict Prisma typing issues in this file
      data: {
        email,
        password: hashed,
        name: `${firstName || ""} ${lastName || ""}`.trim() || undefined,
        avatarUrl,
        role: ('VIEWER' as any),
        tenantId: tenant.id
      } as any,
    } as any) as any;

    // NOTE: you may want to create an auth session here (JWT / Supabase Auth) — leaving out to match your stack
    // return safe public user object (omit password)
    const publicUser = { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId }
    return NextResponse.json({ ok: true, user: publicUser }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
