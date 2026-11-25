"use client"
import { useState } from 'react'

export function MatchLiveControl({matchId,current}:{matchId:string;current:string}){
  const [status,setStatus]=useState(current); const [busy,setBusy]=useState(false); const [error,setError]=useState('')
  async function update(next:string){setBusy(true);setError('');try{const r=await fetch('/api/admin/matches/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({matchId,liveStatus:next})});const j=await r.json();if(!r.ok)throw new Error(j.error);setStatus(next)}catch(e:any){setError(e.message)}finally{setBusy(false)}}
  return <div className="live-control"><select value={status} disabled={busy} onChange={e=>update(e.target.value)}><option value="scheduled">Scheduled</option><option value="called">Called</option><option value="on_court">On court</option><option value="paused">Paused</option><option value="delayed">Delayed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>{error&&<small className="error-text">{error}</small>}</div>
}
