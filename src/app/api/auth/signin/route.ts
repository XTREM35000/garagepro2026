import { NextResponse } from "next/server";
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Sign in with Supabase
    const { data, error } = await (supabaseAdmin as any).auth.admin.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      return NextResponse.json({ error: error?.message || "Authentication failed" }, { status: 401 });
    }

    const authUser = data.user;

    // Fetch user profile from Prisma to get the role
    const { data: userProfile, error: profileError } = await (supabaseAdmin as any)
      .from('User')
      .select('id, email, name, role, tenantId, avatarUrl')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Update user metadata with the role
    await (supabaseAdmin as any).auth.admin.updateUserById(authUser.id, {
      user_metadata: {
        ...authUser.user_metadata,
        role: userProfile.role,
        full_name: userProfile.name,
      },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        name: userProfile.name,
        role: userProfile.role,
        tenantId: userProfile.tenantId,
        avatarUrl: userProfile.avatarUrl,
      },
    }, { status: 200 });
  } catch (err: any) {
    console.error('[api/auth/signin]', err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
