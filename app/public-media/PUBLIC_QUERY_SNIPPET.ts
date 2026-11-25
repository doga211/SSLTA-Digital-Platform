import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();

const { data: media, error } = await supabase

  .from("media")
  .select(`
    id,
    title,
    description,
    alt_text,
    category,
    file_url,
    bucket_id,
    storage_path,
    media_type,
    event_id,
    photographer_credit,
    captured_on
  `)
  .eq("is_public", true)
  .eq("publication_status", "published")
  .in("permission_status", ["approved", "not_required"])
  .in("consent_status", ["approved", "not_applicable"])
  .order("created_at", { ascending: false });