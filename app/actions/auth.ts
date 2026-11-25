"use server";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export async function signInAdmin(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) redirect("/admin?error=database");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin?error=credentials");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin?error=credentials");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || !["super_admin", "admin", "editor", "staff", "tournament_official"].includes(profile.role)) {
    await supabase.auth.signOut();
    redirect("/admin?error=unauthorized");
  }
  redirect("/admin/dashboard");
}

export async function signOutAdmin() {
  const supabase = await createServerSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin");
}
