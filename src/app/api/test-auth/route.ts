import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Vérifier le Super Admin
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', 'super@admin.com')
      .single();

    if (error) {
      return NextResponse.json({ error: "User not found" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hasPassword: !!user.password
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
