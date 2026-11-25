"use client";
import { useState } from "react";

export function DrawGenerator({ categories }: { categories: Array<{ id: string; name: string }> }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function generate() {
    if (!categoryId) return;
    setBusy(true); setMessage("");
    const res = await fetch("/api/admin/draws/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categoryId }) });
    const json = await res.json();
    setBusy(false);
    setMessage(res.ok ? `Draw generated: ${json.drawSize}-slot bracket, ${json.matches} matches.` : json.error ?? "Generation failed.");
  }
  return <div className="admin-panel">
    <h3>Generate Knockout Draw</h3>
    <p className="muted">Only eligible or verified registrations are included. Seeding and BYEs are calculated deterministically.</p>
    <div className="form-row">
      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} disabled={busy}>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button className="btn btn-primary" onClick={generate} disabled={busy || !categoryId}>{busy ? "Generating…" : "Generate Draw"}</button>
    </div>
    {message && <div className="empty-state">{message}</div>}
  </div>
}
