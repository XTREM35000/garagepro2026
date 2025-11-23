export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const GLOBAL_TENANT_ID = "00000000-0000-0000-0000-000000000000";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, avatarUrl } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return NextResponse.json({ error: "Clés Supabase manquantes" }, { status: 500 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    // 🔥 Vérifier si le super admin existe
    const existing = await prisma.user.findFirst({ where: { role: "super_admin" } });
    if (existing) {
      return NextResponse.json(
        { error: "Super admin déjà existant" },
        { status: 400 }
      );
    }

    // 🔥 Vérifier / créer tenant global
    let globalTenant = await prisma.tenant.findUnique({
      where: { id: GLOBAL_TENANT_ID },
    });

    if (!globalTenant) {
      await prisma.tenant.create({
        data: {
          id: GLOBAL_TENANT_ID,
          name: "GLOBAL_ADMIN",
        },
      });
    }

    // 1️⃣ CRÉER UTILISATEUR SUPABASE (sans id imposé)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: "super_admin",
        tenant_id: GLOBAL_TENANT_ID,
        avatarUrl: avatarUrl ?? null,
      },
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Erreur création utilisateur Supabase", details: error.message },
        { status: 500 }
      );
    }

    const supabaseUser = data.user;
    if (!supabaseUser) {
      return NextResponse.json(
        { error: "Utilisateur Supabase introuvable après création" },
        { status: 500 }
      );
    }

    // 2️⃣ INSERER DANS PRISMA AVEC LE VRAI ID SUPABASE
    await prisma.user.create({
      data: {
        id: supabaseUser.id,
        name: `${firstName} ${lastName}`,
        avatarUrl: avatarUrl,
        role: "super_admin",
        tenantId: GLOBAL_TENANT_ID,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        user: { id: supabaseUser.id, role: "super_admin" },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Erreur serveur", details: err.message },
      { status: 500 }
    );
  }
}
