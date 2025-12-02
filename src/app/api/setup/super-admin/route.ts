// src/app/api/setup/super-admin/route.ts - VERSION FINALE CORRIGÉE
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

// Valeurs VALIDES basées sur votre enum UserRole
const VALID_ROLES = {
  SUPER_ADMIN: 'super_admin',     // ← LA BONNE VALEUR !
  TENANT_ADMIN: 'tenant_admin',
  ADMIN: 'admin',
  AGENT_PHOTO: 'agent_photo',
  CAISSIER: 'caissier',
  COMPTABLE: 'comptable',
  TECHNICIEN: 'technicien',
  VIEWER: 'viewer'
} as const;

export async function POST(req: Request) {
  try {
    console.log('🔧 Création Super Admin - Valeur enum: "super_admin"');

    // Configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: "Configuration Supabase manquante"
      }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const body = await req.json();
    const { firstName, lastName, email, password, avatarUrl, phone } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({
        error: "Prénom, Nom, Email et Mot de passe requis"
      }, { status: 400 });
    }

    // ÉTAPE 1: Vérifier si un super_admin existe déjà
    console.log('🔍 Vérification super_admin existant...');
    const { data: existingSuperAdmin, error: checkError } = await supabaseAdmin
      .from('User')
      .select('id, email, name, role')
      .eq('role', VALID_ROLES.SUPER_ADMIN) // ← LA BONNE VALEUR
      .limit(1);

    if (checkError) {
      console.error('❌ Erreur vérification:', checkError);
      return NextResponse.json({
        error: "Erreur de vérification",
        details: checkError.message
      }, { status: 500 });
    }

    if (existingSuperAdmin && existingSuperAdmin.length > 0) {
      const admin = existingSuperAdmin[0];
      console.log('⚠️ Super admin existe déjà:', admin);
      return NextResponse.json({
        error: `Un super admin existe déjà (${admin.email})`,
        existingAdmin: {
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }, { status: 400 });
    }

    // ÉTAPE 2: Vérifier si l'email existe
    console.log('📧 Vérification email...');
    const { data: existingEmail, error: emailError } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (emailError) {
      console.error('❌ Erreur vérification email:', emailError);
    }

    if (existingEmail && existingEmail.length > 0) {
      return NextResponse.json({
        error: "Cet email est déjà utilisé"
      }, { status: 400 });
    }

    // ÉTAPE 3: Créer l'utilisateur auth (optionnel mais recommandé)
    console.log('👤 Création auth.users...');
    let authUserId: string = randomUUID();
    let authCreated = false;
    let authDetails = null;

    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase(),
        password: password,
        email_confirm: true,
        user_metadata: {
          name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl || null
        }
      });

      if (authError) {
        console.warn('⚠️ Auth.users échoué:', authError.message);
        authDetails = { error: authError.message };
      } else if (authData?.user?.id) {
        authUserId = authData.user.id;
        authCreated = true;
        authDetails = {
          id: authUserId,
          email: authData.user.email,
          created_at: authData.user.created_at
        };
        console.log('✅ Auth user créé:', authUserId);
      }
    } catch (authErr: any) {
      console.warn('⚠️ Exception auth:', authErr.message);
      authDetails = { error: authErr.message };
    }

    // ÉTAPE 4: Hash du mot de passe pour la table User
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    // ÉTAPE 5: Créer l'utilisateur dans la table User
    console.log('📝 Création dans table User...');

    const userData = {
      id: authUserId,
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      password: hashedPassword, // Important: password HASHÉ
      role: VALID_ROLES.SUPER_ADMIN, // ← LA BONNE VALEUR ICI AUSSI
      tenantId: null, // Super admin n'a pas de tenant
      avatarUrl: avatarUrl || null,
      phone: phone || null,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
      // Note: Pas de firstName/lastName - utilisation du champ "name"
    };

    console.log('📦 Données User à insérer:', {
      id: userData.id.substring(0, 8) + '...',
      name: userData.name,
      email: userData.email,
      role: userData.role,
      hasPassword: !!userData.password
    });

    const { data: createdUser, error: insertError } = await supabaseAdmin
      .from('User')
      .insert(userData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erreur insertion User:', insertError);

      // Rollback: supprimer l'utilisateur auth si créé
      if (authCreated) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(authUserId);
          console.log('↩️ Rollback: auth user supprimé');
        } catch (delErr) {
          console.error('❌ Erreur rollback auth:', delErr);
        }
      }

      return NextResponse.json({
        error: "Échec création utilisateur",
        details: insertError.message,
        hint: "Vérifiez que toutes les colonnes requises sont fournies"
      }, { status: 500 });
    }

    // ÉTAPE 6: Créer tenant platform pour le super admin
    console.log('🏢 Création Tenant platform...');
    try {
      // Vérifier d'abord
      const { data: existingPlatform } = await supabaseAdmin
        .from('Tenant')
        .select('id')
        .eq('isPlatform', true)
        .limit(1);

      let platformId = existingPlatform?.[0]?.id;

      if (!platformId) {
        platformId = randomUUID();
        const { error: tenantError } = await supabaseAdmin
          .from('Tenant')
          .insert({
            id: platformId,
            name: 'Platform',
            isPlatform: true,
            superAdminId: authUserId,
            createdAt: now,
            updatedAt: now
          });

        if (tenantError) {
          console.warn('⚠️ Tenant platform non créé:', tenantError.message);
        } else {
          console.log('✅ Tenant platform créé:', platformId);
        }
      } else {
        console.log('ℹ️ Tenant platform existe déjà:', platformId);
      }
    } catch (tenantErr: any) {
      console.warn('⚠️ Erreur tenant:', tenantErr.message);
      // Ne pas échouer si le tenant échoue
    }

    // SUCCÈS
    console.log('🎉 Super admin créé avec succès!');
    return NextResponse.json({
      success: true,
      message: authCreated
        ? "✅ Super admin créé dans auth.users et table User"
        : "⚠️ Super admin créé dans table User uniquement (auth.users échoué)",
      user: {
        id: authUserId,
        name: `${firstName} ${lastName}`,
        email: email,
        role: VALID_ROLES.SUPER_ADMIN,
        authCreated: authCreated,
        authDetails: authDetails
      },
      timestamp: now
    }, { status: 201 });

  } catch (error: any) {
    console.error('💥 Erreur serveur inattendue:', error);
    return NextResponse.json({
      error: "Erreur serveur interne",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}