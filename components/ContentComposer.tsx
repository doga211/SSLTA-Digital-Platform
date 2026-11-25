"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ContentComposer({kind}:{kind:'news'|'event'}){
  const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const router=useRouter();
  async function submit(formData:FormData){setBusy(true);setMessage('');const payload=Object.fromEntries(formData.entries());
    try{const response=await fetch('/api/admin/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,kind})});const result=await response.json();if(!response.ok)throw new Error(result.error??'Unable to save.');setMessage(`Saved as draft: ${result.item.title}`);router.refresh();(document.getElementById(`${kind}-composer`) as HTMLFormElement|null)?.reset();}
    catch(error:any){setMessage(error.message??'Unable to save.')}finally{setBusy(false)}}
  return <form id={`${kind}-composer`} action={submit} className="form" style={{display:'grid',gap:12,marginTop:16}}>
    <h3>{kind==='news'?'Create news / blog story':'Register an event'}</h3>
    <input name="title" placeholder="Title" required/>
    <input name="category" placeholder="Category"/>
    {kind==='news'?<><input name="excerpt" placeholder="Short excerpt" required/><textarea name="body" placeholder="Full story / article" rows={6} required/><select name="content_type" defaultValue="historical_story"><option value="news">News</option><option value="blog">Blog</option><option value="historical_story">Historical story</option><option value="announcement">Announcement</option></select><input name="source_document" placeholder="Source document / provenance"/><textarea name="source_note" placeholder="Verification and editorial notes" rows={2}/></>:<><input name="date_label" placeholder="Date label (e.g. 8–10 March 2027)"/><label>Start date<input type="date" name="starts_on"/></label><label>End date<input type="date" name="ends_on"/></label><input name="venue" placeholder="Venue"/><input name="event_type" placeholder="Event type (competition / development / milestone)"/><textarea name="summary" placeholder="Event summary" rows={3}/><textarea name="description" placeholder="Full event description" rows={4}/><input name="source_document" placeholder="Source document / approval reference"/><textarea name="source_note" placeholder="Source and verification notes" rows={2}/><select name="recurrence" defaultValue="none"><option value="none">One-time</option><option value="annual">Annual proposal</option></select></>}
    <button className="btn btn-primary" disabled={busy}>{busy?'Saving…':'Save as Draft'}</button>{message&&<p role="status">{message}</p>}
  </form>
}
