import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>, _headers?: Headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies; Proxy/session refresh handles this.
        }
      },
    } as any,
  });
}

export async function requireAdmin() {
  const supabase = await createServerSupabase();
  if (!supabase) return { supabase: null, profile: null, error: "Supabase is not configured" };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, profile: null, error: "You must sign in" };
  const { data: profile, error } = await supabase.from("profiles").select("id,full_name,email,role").eq("id", user.id).maybeSingle();
  if (error || !profile || !["super_admin", "admin", "editor", "tournament_official", "staff"].includes(profile.role)) {
    return { supabase, profile: null, error: "Your account does not have an SSLTA management profile" };
  }
  return { supabase, profile, error: null };
}

export function isManagementRole(role: string) {
  return ["super_admin", "admin", "editor", "staff", "tournament_official"].includes(role);
}
