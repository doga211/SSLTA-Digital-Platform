import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { id } = await context.params;
    const { data: media, error } = await supabase
      .from("media").select("*").eq("id", id).single();

    if (error || !media) {
      return NextResponse.json({ error: "Media not found." }, { status: 404 });
    }

    let preview_url: string | null = null;

    if (media.bucket_id === "sslta-images" && media.storage_path) {
      const eligible =
        media.is_public &&
        media.publication_status === "published" &&
        ["approved", "not_required"].includes(media.permission_status) &&
        ["approved", "not_applicable"].includes(media.consent_status);

      if (eligible) {
        const { data } = supabase.storage.from("sslta-images")
          .getPublicUrl(media.storage_path);
        preview_url = data.publicUrl;
      }
    } else if (media.bucket_id && media.storage_path) {
      const { data } = await supabase.storage.from(media.bucket_id)
        .createSignedUrl(media.storage_path, 300);
      preview_url = data?.signedUrl || null;
    } else if (media.file_url && !media.file_url.startsWith("storage://")) {
      preview_url = media.file_url;
    }

    return NextResponse.json({ media: { ...media, preview_url } });
  } catch (error) {
    console.error("Media detail:", error);
    return NextResponse.json({ error: "Unable to load media." }, { status: 500 });
  }
}