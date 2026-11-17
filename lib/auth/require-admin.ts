import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { SSLTARole } from './roles'

export async function getCurrentProfile() {
  const supabase = await createClient()
  if (!supabase) return null

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
