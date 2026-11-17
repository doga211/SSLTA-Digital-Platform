import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { rankSnapshot, stableSnapshotChecksum } from '@/lib/tournament/publication'
export async function POST(request:Request){
  try{
    const profile=await requireAdmin(['super_admin','admin','ranking_officer']); const body=await request.json(); const seasonId=String(body.seasonId??'')
    if(!seasonId)return NextResponse.json({error:'seasonId is required.'},{status:400})
    const supabase=await createClient(); if(!supabase)return NextResponse.json({error:'Supabase is not configured.'},{status:503})
    const {data:season,error:seasonError}=await supabase.from('ranking_seasons').select('id,name,category,status').eq('id',seasonId).single()
    if(seasonError||!season)return NextResponse.json({error:seasonError?.message??'Season not found.'},{status:404})
    if(!['active','frozen','published'].includes(season.status))return NextResponse.json({error:'Season must be active, frozen or published before publication.'},{status:400})
    const {data:points,error:pointsError}=await supabase.from('ranking_points').select('player_id,points,players(full_name)').eq('season_id',seasonId)
    if(pointsError)return NextResponse.json({error:pointsError.message},{status:400})
    const totals=new Map<string,{playerId:string;playerName:string;points:number}>()
    for(const row of points??[]){const current=totals.get(row.player_id)??{playerId:row.player_id,playerName:(row as any).players?.full_name??'Player',points:0}; current.points+=Number(row.points??0); totals.set(row.player_id,current)}
    const snapshot=rankSnapshot([...totals.values()]); const checksum=stableSnapshotChecksum(snapshot)
    const {data:previous}=await supabase.from('ranking_publications').select('id').eq('season_id',seasonId).eq('status','published').order('published_at',{ascending:false}).limit(1)
    if(previous?.[0]) await supabase.from('ranking_publications').update({status:'superseded'}).eq('id',previous[0].id)
    const {data:publication,error}=await supabase.from('ranking_publications').insert({season_id:seasonId,category:season.category,status:'published',published_by:profile.id,snapshot,checksum}).select('id,published_at,checksum').single()
    if(error)return NextResponse.json({error:error.message},{status:400})
    await supabase.from('ranking_seasons').update({status:'published'}).eq('id',seasonId)
    await supabase.from('audit_logs').insert({actor_id:profile.id,action:'ranking.publication_created',entity_type:'ranking_publication',entity_id:publication.id,metadata:{season_id:seasonId,checksum,entries:snapshot.length}})
    return NextResponse.json({publicationId:publication.id,entries:snapshot.length,checksum})
  }catch(error:any){return NextResponse.json({error:error?.message??'Unable to publish ranking.'},{status:400})}
}
