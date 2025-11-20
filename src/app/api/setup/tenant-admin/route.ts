import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Supabase env missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

/**
 * POST: create tenant + create supabase user (admin) + create public.User row (Prisma)
 *
 * Expected body: { tenantName, firstName, lastName, email, password, avatarUrl? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantName, firstName, lastName, email, password, avatarUrl } = body ?? {};

    // Basic validation
    if (!tenantName || !firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Configuration Supabase manquante" }, { status: 500 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 1) Create Tenant (Prisma) first so we have tenantId available for triggers
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        logoUrl: null,
      },
    });

    // 2) Create Supabase auth user with tenantId in user_metadata
    // Passing user_metadata is important if your DB trigger expects tenantId there
    const createUserPayload: any = {
      email,
      password,
      email_confirm: true, // set according to your policy
      // raw_user_meta_data or user_metadata may be read by custom triggers;
      // supply both to maximize compatibility.
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        tenantId: tenant.id,
      },
      raw_user_meta_data: {
        first_name: firstName,
        last_name: lastName,
        tenantId: tenant.id,
      },
    };

    const { data: supaData, error: supaError } = await supabaseAdmin.auth.admin.createUser(createUserPayload as any);

    // Log la réponse complète de Supabase pour debug
    console.log('Réponse Supabase createUser:', JSON.stringify({ data: supaData, error: supaError }, null, 2));

    if (supaError) {
      // If Supabase failed, remove created tenant (attempt rollback) and return error
      try {
        await prisma.tenant.delete({ where: { id: tenant.id } });
      } catch (delErr) {
        console.error("Rollback failed (tenant delete):", delErr);
      }

      console.error("Supabase createUser error:", supaError);
      // Return helpful debug info but avoid leaking secrets
      return NextResponse.json(
        {
          error: "Erreur création utilisateur Supabase",
          details: supaError.message || supaError,
          hint:
            "Vérifiez le trigger SQL d'auto-création public.User et les colonnes obligatoires (tenantId, contraintes). Si vous avez appliqué une migration qui modifie auth.users, restaurez-la.",
        },
        { status: 500 }
      );
    }

    // supaData.user should exist when success
    const supaUser = (supaData as any)?.user;
    if (!supaUser || !supaUser.id) {
      // Unexpected response shape: rollback tenant and error
      await prisma.tenant.delete({ where: { id: tenant.id } });
      return NextResponse.json({ error: "Réponse Supabase inattendue (user absent)" }, { status: 500 });
    }

    // Vérifier si l'utilisateur existe déjà dans Prisma (idempotence)
    const existingUser = await prisma.user.findUnique({ where: { id: supaUser.id } });
    if (existingUser) {
      return NextResponse.json({ ok: true, user: { id: existingUser.id, role: existingUser.role }, info: 'Utilisateur déjà présent dans public.User' }, { status: 200 });
    }

    // 3) Create public.User (Prisma) using the Supabase user id
    // Map role -> use 'admin' for tenant admin
    try {
      const userRow = await prisma.user.create({
        data: {
          id: supaUser.id, // Supabase auth UUID
          name: `${firstName} ${lastName}`,
          avatarUrl: avatarUrl ?? null,
          role: "admin", // corresponds to your enum value in Prisma schema
          tenantId: tenant.id,
        },
      });

      // Optionally: auto sign-in - here we return the created tenant + user id
      return NextResponse.json(
        {
          ok: true,
          tenant: { id: tenant.id, name: tenant.name },
          user: { id: userRow.id, name: userRow.name, role: userRow.role },
        },
        { status: 201 }
      );
    } catch (prismaErr: any) {
      // If Prisma insertion fails, we have to rollback supabase user and tenant if possible
      console.error("Prisma create user error:", prismaErr);

      // try delete supabase user
      try {
        await supabaseAdmin.auth.admin.deleteUser(supaUser.id);
      } catch (e) {
        console.error("Failed to delete supabase user during rollback:", e);
      }

      // delete tenant
      try {
        await prisma.tenant.delete({ where: { id: tenant.id } });
      } catch (e) {
        console.error("Failed to delete tenant during rollback:", e);
      }

      return NextResponse.json(
        {
          error: "Erreur création en base (Prisma). Rollback initié.",
          details: prismaErr?.message || String(prismaErr),
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Unexpected API error:", err);
    return NextResponse.json({ error: "Erreur serveur inattendue", details: err?.message || String(err) }, { status: 500 });
  }
}
