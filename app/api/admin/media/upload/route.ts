import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
// PLACEHOLDER: replace with the existing SSLTA server Supabase client import.
import { createClient } from "@/lib/supabase/server";
import { validateMediaFile } from "@/lib/media/media-validation";
import { validateMediaSignature } from "@/lib/media/media-signutre";

const ROLES = ["super_admin", "admin", "editor"];

export async function POST(request: NextRequest) {
  let supabase: any;
  let uploadedBucket: string | null = null;
  let uploadedPath: string | null = null;

  try {
    supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();

    if (profileError || !profile || !ROLES.includes(profile.role)) {
      return NextResponse.json({ error: "Not authorised to upload media." }, { status: 403 });
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }

    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!(await validateMediaSignature(file))) {
      return NextResponse.json({ error: "File signature does not match its declared type." }, { status: 400 });
    }

    const bucket = validation.mediaType === "image"
      ? "sslta-media-staging"
      : "sslta-videos";

    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${validation.mediaType}/${user.id}/${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    uploadedBucket = bucket;
    uploadedPath = path;

    const value = (key: string) => {
      const entry = form.get(key);
      return typeof entry === "string" ? entry.trim() || null : null;
    };

    const { data, error: insertError } = await supabase
      .from("media")
      .insert({
        title: value("title"),
        description: value("description"),
        category: value("category"),
        alt_text: value("alt_text"),
        photographer_credit: value("photographer_credit"),
        file_url: `storage://${bucket}/${path}`,
        bucket_id: bucket,
        storage_path: path,
        media_type: validation.mediaType,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: user.id,
        permission_status: "pending",
        consent_status: "pending",
        publication_status: "draft",
        is_public: false,
        event_attribution_verified: false,
      })
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from(bucket).remove([path]);
      uploadedBucket = null;
      uploadedPath = null;
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, media: data }, { status: 201 });
  } catch (error) {
    if (supabase && uploadedBucket && uploadedPath) {
      await supabase.storage.from(uploadedBucket).remove([uploadedPath]);
    }
    console.error("Media upload:", error);
    return NextResponse.json({ error: "Unexpected upload error." }, { status: 500 });
  }
}