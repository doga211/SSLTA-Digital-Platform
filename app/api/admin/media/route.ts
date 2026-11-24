// import { NextRequest, NextResponse } from "next/server";
// // PLACEHOLDER: replace with the existing SSLTA server Supabase client import.
// import { createClient } from "@/lib/supabase/server";

// export async function GET(request: NextRequest) {
//   try {
//     const supabase = await createClient();
//     const { data: { user }, error: authError } = await supabase.auth.getUser();

//     if (authError || !user) {
//       return NextResponse.json({ error: "Authentication required." }, { status: 401 });
//     }
// const SIGNED_URL_EXPIRY = 60 * 60; // 1 hour

// function parseStorageReference(fileUrl: string) {
//     if (!fileUrl.startsWith("storage://")) return null;

//     const reference = fileUrl.slice("storage://".length);
//     const separator = reference.indexOf("/");

//     if (separator === -1) return null;

//     return {
//         bucket: reference.slice(0, separator),
//         path: reference.slice(separator + 1),
//     };
// }

// async function resolvePrivateMediaUrl(
//     supabase: any,
//     fileUrl: string
// ) {
//     const reference = parseStorageReference(fileUrl);

//     if (!reference) return fileUrl;

//     const { data, error } = await supabase.storage
//         .from(reference.bucket)
//         .createSignedUrl(
//             reference.path,
//             SIGNED_URL_EXPIRY
//         );

//     if (error) {
//         console.error("Media signed URL error:", error.message);
//         return null;
//     }

//     return data.signedUrl;
// }
//     const params = request.nextUrl.searchParams;
//     const page = Math.max(1, Number(params.get("page") || 1));
//     const pageSize = 20;
//     const from = (page - 1) * pageSize;
//     const to = from + pageSize - 1;

//     let query = supabase.from("media").select("*", { count: "exact" })
//       .order("created_at", { ascending: false })
//       .range(from, to);

//     const category = params.get("category");
//     const mediaType = params.get("media_type");
//     const publicationStatus = params.get("publication_status");
//     const permissionStatus = params.get("permission_status");
//     const consentStatus = params.get("consent_status");
//     const search = params.get("search")?.trim();

//     if (category) query = query.eq("category", category);
//     if (mediaType) query = query.eq("media_type", mediaType);
//     if (publicationStatus) query = query.eq("publication_status", publicationStatus);
//     if (permissionStatus) query = query.eq("permission_status", permissionStatus);
//     if (consentStatus) query = query.eq("consent_status", consentStatus);

//     // Use a single-field ilike filter to avoid interpolating user text into
//     // a PostgREST .or() expression. Expand to a dedicated search RPC later.
//     if (search) query = query.ilike("title", `%${search}%`);

//     const { data, error, count } = await query;

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }

//     const records = await Promise.all((data || []).map(async (item: any) => {
//       let preview_url: string | null = null;

//       if (item.bucket_id === "sslta-images" && item.storage_path) {
//         const { data: publicData } = supabase.storage
//           .from("sslta-images").getPublicUrl(item.storage_path);

//         // Never return public preview for an ineligible record.
//         if (
//           item.is_public &&
//           item.publication_status === "published" &&
//           ["approved", "not_required"].includes(item.permission_status) &&
//           ["approved", "not_applicable"].includes(item.consent_status)
//         ) {
//           preview_url = publicData.publicUrl;
//         }
//       } else if (item.bucket_id && item.storage_path) {
//         const { data: signed } = await supabase.storage
//           .from(item.bucket_id).createSignedUrl(item.storage_path, 300);
//         preview_url = signed?.signedUrl || null;
//       } else if (item.file_url && !item.file_url.startsWith("storage://")) {
//         preview_url = item.file_url;
//       }

//       return { ...item, preview_url };
//     }));

//     return NextResponse.json({
//       data: records,
//       pagination: {
//         page,
//         pageSize,
//         total: count || 0,
//         totalPages: Math.ceil((count || 0) / pageSize),
//       },
//     });
//   } catch (error) {
//     console.error("Media listing:", error);
//     return NextResponse.json({ error: "Unable to load media." }, { status: 500 });
//   }
// }










import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SIGNED_URL_EXPIRY = 60 * 60; // 1 hour

type StorageReference = {
    bucket: string;
    path: string;
};

function parseStorageReference(
    fileUrl?: string | null
): StorageReference | null {
    if (!fileUrl?.startsWith("storage://")) return null;

    const reference = fileUrl.slice("storage://".length);
    const separator = reference.indexOf("/");

    if (separator === -1) return null;

    const bucket = reference.slice(0, separator);
    const path = reference.slice(separator + 1);

    if (!bucket || !path) return null;

    return { bucket, path };
}

async function resolveMediaUrl(
    supabase: Awaited<ReturnType<typeof createClient>>,
    item: Record<string, any>
): Promise<string | null> {
    // Support both the newer bucket/path columns and older storage:// records.
    const reference =
        item.bucket_id && item.storage_path
            ? {
                  bucket: item.bucket_id,
                  path: item.storage_path,
              }
            : parseStorageReference(item.file_url);

    if (reference) {
        const { data, error } = await supabase.storage
            .from(reference.bucket)
            .createSignedUrl(reference.path, SIGNED_URL_EXPIRY);

        if (error) {
            console.error(
                `Unable to sign media URL for ${item.id}:`,
                error.message
            );
            return null;
        }

        return data.signedUrl;
    }

    // Existing local assets and already accessible URLs.
    if (
        typeof item.file_url === "string" &&
        (item.file_url.startsWith("/") ||
            item.file_url.startsWith("https://") ||
            item.file_url.startsWith("http://"))
    ) {
        return item.file_url;
    }

    return null;
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Authentication required." },
                { status: 401 }
            );
        }

        const params = request.nextUrl.searchParams;

        const requestedPage = Number(params.get("page") || 1);
        const page = Number.isFinite(requestedPage)
            ? Math.max(1, Math.floor(requestedPage))
            : 1;

        const pageSize = 20;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
            .from("media")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        const category = params.get("category");
        const mediaType = params.get("media_type");
        const publicationStatus = params.get("publication_status");
        const permissionStatus = params.get("permission_status");
        const consentStatus = params.get("consent_status");
        const search = params.get("search")?.trim();

        if (category) {
            query = query.eq("category", category);
        }

        if (mediaType) {
            query = query.eq("media_type", mediaType);
        }

        if (publicationStatus) {
            query = query.eq("publication_status", publicationStatus);
        }

        if (permissionStatus) {
            query = query.eq("permission_status", permissionStatus);
        }

        if (consentStatus) {
            query = query.eq("consent_status", consentStatus);
        }

        if (search) {
            query = query.ilike("title", `%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error("Media query error:", error.message);

            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        const records = await Promise.all(
            (data || []).map(async (item) => {
                const previewUrl = await resolveMediaUrl(
                    supabase,
                    item as Record<string, any>
                );

                return {
                    ...item,
                    preview_url: previewUrl,
                    imageUrl: previewUrl,
                };
            })
        );

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
        console.error("Media listing error:", error);

        return NextResponse.json(
            { error: "Unable to load media." },
            { status: 500 }
        );
    }
}
