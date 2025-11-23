export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    const { tenantName, firstName, lastName, email, password, avatarUrl } =
      await request.json();

    if (!tenantName || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Configuration Supabase manquante" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    //
    // 1️⃣ CRÉATION DU TENANT
    //
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        logoUrl: null,
      },
    });

    //
    // 2️⃣ CRÉATION UTILISATEUR SUPABASE AUTH
    //
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        tenantId: tenant.id, // ⚠️ le nom EXACT que tu utilises dans ton trigger
        role: "admin",
        avatarUrl: avatarUrl ?? null,
      },
    });

    if (error) {
      // Rollback tenant only if user creation fails
      await prisma.tenant.delete({ where: { id: tenant.id } });

      return NextResponse.json(
        {
          error: "Erreur création utilisateur Supabase",
          details: error.message,
        },
        { status: 500 }
      );
    }

    const supaUser = data.user;
    if (!supaUser) {
      await prisma.tenant.delete({ where: { id: tenant.id } });

      return NextResponse.json(
        { error: "Supabase ne renvoie aucun utilisateur" },
        { status: 500 }
      );
    }

    //
    // 3️⃣ CRÉATION public.User — UNIQUEMENT SI TON TRIGGER NE LE FAIT PAS
    //
    const alreadyExists = await prisma.user.findUnique({
      where: { id: supaUser.id },
    });

    if (!alreadyExists) {
      await prisma.user.create({
        data: {
          id: supaUser.id,
          name: `${firstName} ${lastName}`,
          avatarUrl: avatarUrl ?? null,
          role: "admin",
          tenantId: tenant.id,
        },
      });
    }

    return NextResponse.json(
      {
        ok: true,
        tenant,
        user: {
          id: supaUser.id,
          email: supaUser.email,
          role: "admin",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Erreur serveur", details: err.message },
      { status: 500 }
    );
  }
}
