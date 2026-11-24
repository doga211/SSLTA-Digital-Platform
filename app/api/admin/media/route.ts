import { NextRequest, NextResponse } from "next/server";
// PLACEHOLDER: replace with the existing SSLTA server Supabase client import.
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get("page") || 1));
    const pageSize = 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from("media").select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    const category = params.get("category");
    const mediaType = params.get("media_type");
    const publicationStatus = params.get("publication_status");
    const permissionStatus = params.get("permission_status");
    const consentStatus = params.get("consent_status");
    const search = params.get("search")?.trim();

    if (category) query = query.eq("category", category);
    if (mediaType) query = query.eq("media_type", mediaType);
    if (publicationStatus) query = query.eq("publication_status", publicationStatus);
    if (permissionStatus) query = query.eq("permission_status", permissionStatus);
    if (consentStatus) query = query.eq("consent_status", consentStatus);

    // Use a single-field ilike filter to avoid interpolating user text into
    // a PostgREST .or() expression. Expand to a dedicated search RPC later.
    if (search) query = query.ilike("title", `%${search}%`);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const records = await Promise.all((data || []).map(async (item: any) => {
      let preview_url: string | null = null;

      if (item.bucket_id === "sslta-images" && item.storage_path) {
        const { data: publicData } = supabase.storage
          .from("sslta-images").getPublicUrl(item.storage_path);

        // Never return public preview for an ineligible record.
        if (
          item.is_public &&
          item.publication_status === "published" &&
          ["approved", "not_required"].includes(item.permission_status) &&
          ["approved", "not_applicable"].includes(item.consent_status)
        ) {
          preview_url = publicData.publicUrl;
        }
      } else if (item.bucket_id && item.storage_path) {
        const { data: signed } = await supabase.storage
          .from(item.bucket_id).createSignedUrl(item.storage_path, 300);
        preview_url = signed?.signedUrl || null;
      } else if (item.file_url && !item.file_url.startsWith("storage://")) {
        preview_url = item.file_url;
      }

      return { ...item, preview_url };
    }));

    return NextResponse.json({
      data: records,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    console.error("Media listing:", error);
    return NextResponse.json({ error: "Unable to load media." }, { status: 500 });
  }
}