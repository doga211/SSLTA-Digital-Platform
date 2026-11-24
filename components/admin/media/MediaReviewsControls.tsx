"use client";

import { useState } from "react";
import { reviewSSLTAmedia } from "@/lib/media/media-review";

type MediaReview = {
  id: string;
  permission_status: string;
  consent_status: string;
  event_attribution_verified: boolean;
  publication_status: string;
};

export default function MediaReviewControls({
  media,
  onUpdatedAction,
}: {
  media: MediaReview;
  onUpdatedAction: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function updateReview(updates: Record<string, unknown>) {
    setLoading(true);
    setMessage("");
    try {
      await reviewSSLTAmedia(media.id, updates);
      setMessage("Review updated.");
      onUpdatedAction();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border p-4">
      <h3 className="text-lg font-semibold">Media Approval & Review</h3>

      <label className="block text-sm">
        Permission status
        <select disabled={loading} value={media.permission_status}
          onChange={(e) => updateReview({ permission_status: e.target.value })}
          className="mt-1 w-full rounded-lg border p-2">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="not_required">Not required</option>
        </select>
      </label>

      <label className="block text-sm">
        Consent status
        <select disabled={loading} value={media.consent_status}
          onChange={(e) => updateReview({ consent_status: e.target.value })}
          className="mt-1 w-full rounded-lg border p-2">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="not_applicable">Not applicable</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" disabled={loading}
          checked={media.event_attribution_verified}
          onChange={(e) => updateReview({
            event_attribution_verified: e.target.checked,
          })} />
        Event attribution verified
      </label>

      <label className="block text-sm">
        Workflow status
        <select disabled={loading} value={media.publication_status}
          onChange={(e) => updateReview({ publication_status: e.target.value })}
          className="mt-1 w-full rounded-lg border p-2">
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <span className="mt-1 block text-xs text-gray-500">
          Publishing is a separate controlled operation.
        </span>
      </label>

      {loading && <p className="text-sm">Saving...</p>}
      {message && <p aria-live="polite" className="text-sm">{message}</p>}
    </section>
  );
}