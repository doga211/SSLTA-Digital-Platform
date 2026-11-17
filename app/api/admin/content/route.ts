import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/require-admin';

const slugify=(value:string)=>value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);

export async function POST(request:Request){
  try{
    const profile=await requireAdmin(['super_admin','admin','editor']);
    const supabase=await createClient(); if(!supabase)return NextResponse.json({error:'Supabase is not configured.'},{status:503});
    const body=await request.json(); const kind=String(body.kind??''); const title=String(body.title??'').trim();
    if(!title)return NextResponse.json({error:'A title is required.'},{status:400});
    const slug=slugify(String(body.slug??title)); if(!slug)return NextResponse.json({error:'A valid title or slug is required.'},{status:400});
    if(kind==='news'){
      const content=String(body.body??'').trim(); const excerpt=String(body.excerpt??'').trim();
      if(!content||!excerpt)return NextResponse.json({error:'An excerpt and article body are required.'},{status:400});
      const {data,error}=await supabase.from('news').insert({title,slug,excerpt,body:content,content_type:['news','blog','historical_story','announcement'].includes(body.content_type)?body.content_type:'news',category:String(body.category??'General').trim(),source_document:String(body.source_document??'').trim()||null,source_note:String(body.source_note??'').trim()||null,status:'draft',author_id:profile.id}).select('id,title,slug,status').single();
      if(error)return NextResponse.json({error:error.message},{status:400});
      await supabase.from('audit_logs').insert({actor_id:profile.id,action:'content.news_created',entity_type:'news',entity_id:data.id,metadata:{slug}});
      return NextResponse.json({item:data}, {status:201});
    }
    if(kind==='event'){
      const startsOn=String(body.starts_on??'').trim()||null;const endsOn=String(body.ends_on??'').trim()||null;if(startsOn&&endsOn&&endsOn<startsOn)return NextResponse.json({error:'Event end date cannot be earlier than its start date.'},{status:400});
      const {data,error}=await supabase.from('events').insert({title,slug,summary:String(body.summary??'').trim()||null,description:String(body.description??'').trim()||null,event_type:String(body.event_type??'competition'),category:String(body.category??'General'),venue:String(body.venue??'').trim()||null,date_label:String(body.date_label??'').trim()||null,starts_on:startsOn,ends_on:endsOn,recurrence:body.recurrence==='annual'?'annual':'none',status:'draft',is_public:false,source_document:String(body.source_document??'').trim()||null,source_note:String(body.source_note??'').trim()||null,created_by:profile.id,updated_by:profile.id}).select('id,title,slug,status').single();
      if(error)return NextResponse.json({error:error.message},{status:400});
      await supabase.from('audit_logs').insert({actor_id:profile.id,action:'content.event_created',entity_type:'event',entity_id:data.id,metadata:{slug}});
      return NextResponse.json({item:data}, {status:201});
    }
    return NextResponse.json({error:'kind must be news or event.'},{status:400});
  }catch(error:any){return NextResponse.json({error:error?.message??'Unable to create content.'},{status:400})}
}

export async function PATCH(request:Request){
  try{
    const profile=await requireAdmin(['super_admin','admin','editor']);
    const supabase=await createClient(); if(!supabase)return NextResponse.json({error:'Supabase is not configured.'},{status:503});
    const body=await request.json(); const kind=String(body.kind??''); const id=String(body.id??''); const status=String(body.status??'');
    if(!id)return NextResponse.json({error:'A content record id is required.'},{status:400});
    if(kind==='news'){
      if(status!=='published'&&status!=='draft'&&status!=='archived')return NextResponse.json({error:'Unsupported news status.'},{status:400});
      if(status==='published'&&!String(body.source_document??'').trim())return NextResponse.json({error:'Add the source/provenance record before publishing.'},{status:400});
      const {data:existing,error:readError}=await supabase.from('news').select('content_type').eq('id',id).single();if(readError||!existing)return NextResponse.json({error:'Content record not found.'},{status:404});
      if(status==='published'&&existing.content_type==='historical_story'&&body.safeguarding_checked!==true)return NextResponse.json({error:'Complete the safeguarding review before publishing this historical story.'},{status:400});
      const update:any={status,reviewed_at:new Date().toISOString(),reviewed_by:profile.id};if(body.safeguarding_checked===true)update.safeguarding_checked=true; if(status==='published')update.published_at=new Date().toISOString();
      const {error}=await supabase.from('news').update(update).eq('id',id); if(error)return NextResponse.json({error:error.message},{status:400});
    }else if(kind==='event'){
      if(!['proposed','published','completed','cancelled','draft'].includes(status))return NextResponse.json({error:'Unsupported event status.'},{status:400});
      if(['published','completed'].includes(status)&&!String(body.approval_note??'').trim())return NextResponse.json({error:'An approval note is required before publishing or marking an event completed.'},{status:400});
      const update:any={status,is_public:status!=='draft',approval_note:String(body.approval_note??'').trim()||null,updated_by:profile.id,updated_at:new Date().toISOString()};
      const {error}=await supabase.from('events').update(update).eq('id',id); if(error)return NextResponse.json({error:error.message},{status:400});
    }else return NextResponse.json({error:'kind must be news or event.'},{status:400});
    await supabase.from('audit_logs').insert({actor_id:profile.id,action:`content.${kind}_${status}`,entity_type:kind,entity_id:id,metadata:{status}});
    return NextResponse.json({ok:true});
  }catch(error:any){return NextResponse.json({error:error?.message??'Unable to update content.'},{status:400})}
}
