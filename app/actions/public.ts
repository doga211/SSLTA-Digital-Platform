"use server";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

const value = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function submitMembershipApplication(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) redirect("/membership?error=database");
  const full_name = value(formData, "full_name");
  const email = value(formData, "email");
  const membership_type = value(formData, "membership_type");
  const phone = value(formData, "phone");
  const club_name = value(formData, "club_name");
  const notes = value(formData, "notes");
  if (!full_name || !email || !membership_type) redirect("/membership?error=required");
  const { error } = await supabase.from("membership_applications").insert({ full_name, email, membership_type, phone: phone || null, club_name: club_name || null, notes: notes || null });
  if (error) redirect("/membership?error=submit");
  redirect("/membership?submitted=1");
}

export async function submitContactEnquiry(formData: FormData) {
  const supabase = await createServerSupabase();
  if (!supabase) redirect("/contact?error=database");
  const full_name = value(formData, "full_name");
  const email = value(formData, "email");
  const enquiry_type = value(formData, "enquiry_type");
  const message = value(formData, "message");
  const phone = value(formData, "phone");
  if (!full_name || !email || !enquiry_type || !message) redirect("/contact?error=required");
  const { error } = await supabase.from("contact_enquiries").insert({ full_name, email, enquiry_type, message, phone: phone || null });
  if (error) redirect("/contact?error=submit");
  redirect("/contact?submitted=1");
}
