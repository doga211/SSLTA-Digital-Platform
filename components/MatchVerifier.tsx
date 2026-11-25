"use client";
import { useState } from "react";

export function MatchVerifier({ matchId }: { matchId: string }) {
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function verify() {
    setBusy(true); setMessage("");
    const res = await fetch("/api/admin/matches/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ matchId, scoreA, scoreB }) });
    const json = await res.json(); setBusy(false);
    setMessage(res.ok ? "Result verified and winner advanced." : json.error ?? "Verification failed.");
  }
  return <div className="score-entry"><input aria-label="Player A score" placeholder="6 6" value={scoreA} onChange={e=>setScoreA(e.target.value)} /><input aria-label="Player B score" placeholder="4 3" value={scoreB} onChange={e=>setScoreB(e.target.value)} /><button className="btn btn-primary" onClick={verify} disabled={busy}>{busy ? "…" : "Verify"}</button>{message && <small>{message}</small>}</div>
}
