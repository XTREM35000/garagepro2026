import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GLOBAL_TENANT_ID = "00000000-0000-0000-0000-000000000000";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, avatarUrl } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Clés Supabase manquantes" }, { status: 500 });
    }

    // Vérifier qu'il n'existe pas déjà un super_admin
    const already = await prisma.user.findFirst({ where: { role: 'super_admin' } });
    if (already) {
      return NextResponse.json({ error: 'Super admin déjà existant' }, { status: 400 });
    }

    // Vérifier que le tenant GLOBAL existe, sinon le créer
    let globalTenant = await prisma.tenant.findUnique({ where: { id: GLOBAL_TENANT_ID } });
    if (!globalTenant) {
      globalTenant = await prisma.tenant.create({
        data: {
          id: GLOBAL_TENANT_ID,
          name: 'GLOBAL_ADMIN',
        },
      });
    }

    // Générer un ID utilisateur que l'on utilisera pour la ligne Prisma
    // et pour créer l'utilisateur Supabase. Cela évite les conditions de
    // course où le trigger crée d'abord public.User puis Prisma tente
    // d'insérer la même id (P2002). En créant d'abord la ligne Prisma
    // avec cet id, le trigger fera un upsert (ON CONFLICT DO UPDATE).
    const newUserId = randomUUID();

    // Créer d'abord l'utilisateur dans public.User (Prisma)
    try {
      await prisma.user.create({
        data: {
          id: newUserId,
          name: `${firstName} ${lastName}`,
          avatarUrl: avatarUrl ?? null,
          role: "super_admin",
          tenantId: GLOBAL_TENANT_ID,
        },
      });
    } catch (err: any) {
      console.error("Erreur création initiale public.User (Prisma):", err);
      return NextResponse.json({ error: "Échec création public.User initiale", details: err.message }, { status: 500 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 1️⃣ Créer l'utilisateur dans Supabase
    // Ajouter explicitement tenant_id (avec underscore) et avatarUrl pour que le trigger DB puisse les lire.
    const payload = {
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
      raw_user_meta_data: {
        first_name: firstName,
        last_name: lastName,
        role: "super_admin",
        tenant_id: GLOBAL_TENANT_ID,
        avatarUrl: avatarUrl ?? null,
      },
      id: newUserId,
    };

    console.log("Supabase createUser payload:", JSON.stringify(payload));

    let supaData: any = null;
    try {
      const res = await supabaseAdmin.auth.admin.createUser(payload as any);
      supaData = (res as any)?.data;
      const supaError = (res as any)?.error;
      if (supaError) {
        console.error("Supabase createUser returned error object:", supaError);
        console.warn("Attempting fallback: try client-side signUp with anon key");
        // If admin.createUser failed, try client signUp as a fallback (uses anon key)
        const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (ANON_KEY) {
          try {
            const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
            const signUpRes = await supabaseAnon.auth.signUp({
              email,
              password,
              options: {
                data: {
                  first_name: firstName,
                  last_name: lastName,
                  role: "super_admin",
                  tenant_id: GLOBAL_TENANT_ID,
                  avatarUrl: avatarUrl ?? null,
                },
              },
            });
            const signUpError = (signUpRes as any)?.error;
            const signUpData = (signUpRes as any)?.data;
            if (signUpError) {
              console.error("Fallback signUp also failed:", signUpError);
              return NextResponse.json(
                { error: "Erreur création utilisateur Supabase (admin + fallback)", details: signUpError?.message ?? signUpError },
                { status: 500 }
              );
            }
            // signUp succeeded — try to extract user id
            const user = signUpData?.user;
            if (user?.id) {
              supaData = { user };
            } else {
              // signUp might require email confirmation — still return success info
              return NextResponse.json({ ok: true, info: 'Utilisateur créé via signUp (confirmation requise)' }, { status: 201 });
            }
          } catch (se: any) {
            console.error("Fallback signUp thrown error:", se);
            return NextResponse.json({ error: "Erreur création utilisateur Supabase (fallback exception)", details: se?.message ?? se }, { status: 500 });
          }
        }

        return NextResponse.json(
          {
            error: "Erreur création utilisateur Supabase",
            details: supaError?.message ?? supaError,
          },
          { status: 500 }
        );
      }
    } catch (e: any) {
      console.error("Supabase createUser thrown error:", e);
      // Try to surface useful fields from the AuthApiError
      const details = {
        message: e?.message,
        status: e?.status ?? e?.response?.status,
        data: e?.response?.data ?? e?.response ?? null,
      };
      return NextResponse.json({ error: "Erreur création utilisateur Supabase (exception)", details }, { status: 500 });
    }

    const supaUser = (supaData as any)?.user;
    if (!supaUser?.id) {
      return NextResponse.json({ error: "ID utilisateur manquant" }, { status: 500 });
    }

    // Vérifier si l'utilisateur existe déjà dans Prisma (idempotence)
    const existingUser = await prisma.user.findUnique({ where: { id: supaUser.id } });
    if (existingUser) {
      return NextResponse.json({ ok: true, user: { id: existingUser.id, role: existingUser.role }, info: 'Utilisateur déjà présent dans public.User' }, { status: 200 });
    }

    // 2️⃣ Inscrire dans public.User (Prisma)
    try {
      await prisma.user.create({
        data: {
          id: supaUser.id,
          name: `${firstName} ${lastName}`,
          avatarUrl: avatarUrl ?? null,
          role: "super_admin",
          tenantId: GLOBAL_TENANT_ID,
        },
      });
    } catch (err: any) {
      console.error("Erreur Prisma:", err);

      // rollback Supabase user
      try {
        await supabaseAdmin.auth.admin.deleteUser(supaUser.id);
      } catch (e) {
        console.error("Rollback Supabase failed:", e);
      }

      return NextResponse.json(
        {
          error: "Échec en base public.User",
          details: err.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        user: { id: supaUser.id, role: "super_admin" },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur", details: err.message }, { status: 500 });
  }
}
