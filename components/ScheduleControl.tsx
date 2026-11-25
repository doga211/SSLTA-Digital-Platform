"use client"
import { useState } from 'react'
export function ScheduleControl({matchId,courts}:{matchId:string;courts:Array<{id:string;name:string}>}){
 const [courtId,setCourtId]=useState(courts[0]?.id??''); const [time,setTime]=useState(''); const [busy,setBusy]=useState(false); const [message,setMessage]=useState('')
 async function submit(){setBusy(true);setMessage('');try{const r=await fetch('/api/admin/scheduling/assign',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({matchId,courtId,scheduledStart:new Date(time).toISOString(),courtName:courts.find(c=>c.id===courtId)?.name})});const j=await r.json();if(!r.ok)throw new Error(j.error);setMessage('Scheduled')}catch(e:any){setMessage(e.message)}finally{setBusy(false)}}
 return <div className="schedule-control"><select value={courtId} onChange={e=>setCourtId(e.target.value)} disabled={busy}>{courts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input type="datetime-local" value={time} onChange={e=>setTime(e.target.value)} disabled={busy}/><button className="btn btn-blue" onClick={submit} disabled={busy||!time||!courtId}>{busy?'Saving…':'Assign'}</button>{message&&<small>{message}</small>}</div>
}
