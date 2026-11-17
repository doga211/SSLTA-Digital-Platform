import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SSLTARole } from './roles'

async function createSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Cookie writes may be unavailable in Server Components.
          }
        },
      },
    },
  )
}

export async function getCurrentProfile() {
  const supabase = await createSupabaseClient()

  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub
  if (!userId) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, avatar_url')
    .eq('id', userId)
    .maybeSingle()

  return profile
}

export async function requireAdmin(allowedRoles?: SSLTARole[]) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/sign-in?next=%2Fadmin%2Fdashboard')

  if (allowedRoles?.length && !allowedRoles.includes(profile.role as SSLTARole)) {
    redirect('/admin/dashboard?error=forbidden')
  }

  return profile
}
