import { NextRequest, NextResponse } from "next/server";
// PLACEHOLDER: replace with the server Supabase client import already used by SSLTA.
import { createClient } from "@/lib/supabase/server";

const ROLES = ["super_admin", "admin", "editor"];
const PERMISSION = ["pending", "approved", "denied", "not_required"];
const CONSENT = ["pending", "approved", "denied", "not_applicable"];
const WORKFLOW = ["draft", "archived"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();

    if (profileError || !profile || !ROLES.includes(profile.role)) {
      return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if ("permission_status" in body) {
      if (!PERMISSION.includes(body.permission_status)) {
        return NextResponse.json({ error: "Invalid permission status." }, { status: 400 });
      }
      updates.permission_status = body.permission_status;
    }

    if ("consent_status" in body) {
      if (!CONSENT.includes(body.consent_status)) {
        return NextResponse.json({ error: "Invalid consent status." }, { status: 400 });
      }
      updates.consent_status = body.consent_status;
    }

    if ("event_attribution_verified" in body) {
      if (typeof body.event_attribution_verified !== "boolean") {
        return NextResponse.json({ error: "Invalid event attribution value." }, { status: 400 });
      }
      updates.event_attribution_verified = body.event_attribution_verified;
    }

    if ("publication_status" in body) {
      if (!WORKFLOW.includes(body.publication_status)) {
        return NextResponse.json({
          error: "Publishing is handled by a separate controlled workflow.",
        }, { status: 409 });
      }
      updates.publication_status = body.publication_status;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "No valid changes supplied." }, { status: 400 });
    }

    if (
      updates.permission_status === "denied" ||
      updates.consent_status === "denied"
    ) {
      updates.is_public = false;
      updates.publication_status = "draft";
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("media").update(updates).eq("id", id).select().single();

    if (error) {
      console.error("Media review update:", error);
      return NextResponse.json({ error: "Unable to update media review." }, { status: 500 });
    }

    return NextResponse.json({ success: true, media: data });
  } catch (error) {
    console.error("Media review route:", error);
    return NextResponse.json({ error: "Unexpected review error." }, { status: 500 });
  }
}