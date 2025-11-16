import { supabaseAdmin } from '@/lib/supabase'

/**
 * Extract Supabase access token from Authorization header.
 * Expected format: "Bearer <token>"
 */
export function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

/**
 * Verify user from token and check tenant/role.
 * Returns { userId, email, role, tenantId } or throws error.
 */
export async function verifyUserAndRole(
  token: string | null,
  requiredRole?: string // 'super_admin' | 'admin' | 'owner'
) {
  if (!token || !supabaseAdmin) throw new Error('Unauthorized')

  try {
    // Get user from token via admin client
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data.user) throw new Error('Invalid token')

    const userId = data.user.id
    const email = data.user.email || ''

    // Fetch user profile from our User table to get role and tenantId
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('User')
      .select('id,role,tenantId')
      .eq('id', userId)
      .maybeSingle()

    if (profileError || !userProfile) throw new Error('User profile not found')

    const { role, tenantId } = userProfile as any

    // Check role if required
    if (requiredRole && role !== requiredRole && role !== 'super_admin') {
      throw new Error(`Forbidden: requires ${requiredRole}`)
    }

    return { userId, email, role, tenantId }
  } catch (e: any) {
    throw new Error(`Auth error: ${String(e.message || e)}`)
  }
}
