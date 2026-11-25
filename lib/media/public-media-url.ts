export function getPublicMediaUrl(supabase: any, media: any): string | null {
  if (media.bucket_id === "sslta-images" && media.storage_path) {
    const { data } = supabase.storage
      .from("sslta-images")
      .getPublicUrl(media.storage_path);

    return data.publicUrl;
  }

  // Backward compatibility for legacy external URLs.
  if (media.file_url && !media.file_url.startsWith("storage://")) {
    return media.file_url;
  }

  return null;
}