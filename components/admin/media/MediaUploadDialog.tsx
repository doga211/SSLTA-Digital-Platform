"use client";

import { useState, type FormEvent } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function MediaUploadDialog({ onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [altText, setAltText] = useState("");
  const [photographerCredit, setPhotographerCredit] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("category", category);
      form.append("description", description);
      form.append("alt_text", altText);
      form.append("photographer_credit", photographerCredit);

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: form,
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Upload failed.");

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upload Media</h2>
          <button type="button" onClick={onClose} className="rounded border px-3 py-1">
            Close
          </button>
        </div>

        <input
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded border p-2"
        />

        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Media title" className="w-full rounded border p-2" />

        <input value={category} onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g. tournament, training)" className="w-full rounded border p-2" />

        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Description" className="w-full rounded border p-2" />

        <input value={altText} onChange={(e) => setAltText(e.target.value)}
          placeholder="Alternative text" className="w-full rounded border p-2" />

        <input value={photographerCredit}
          onChange={(e) => setPhotographerCredit(e.target.value)}
          placeholder="Photographer credit" className="w-full rounded border p-2" />

        <p className="text-xs text-gray-500">
          New uploads are private drafts. Permission and consent remain pending until reviewed.
        </p>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button disabled={busy} className="rounded-lg bg-orange-600 px-5 py-2 text-white disabled:opacity-50">
          {busy ? "Uploading..." : "Upload Media"}
        </button>
      </form>
    </div>
  );
}