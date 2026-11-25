
export type MediaReviewUpdate = {
  permission_status?: "pending" | "approved" | "denied" | "not_required";
  consent_status?: "pending" | "approved" | "denied" | "not_applicable";
  event_attribution_verified?: boolean;
  publication_status?: "draft" | "archived";
};

export async function reviewSSLTAmedia(
  mediaId: string,
  updates: MediaReviewUpdate
) {
  const response = await fetch(`/api/admin/media/${mediaId}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Media review failed.");
  }

  return result.media;
}