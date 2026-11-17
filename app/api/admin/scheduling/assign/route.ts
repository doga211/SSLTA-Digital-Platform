import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/require-admin'

export async function POST(request: Request) {
  try {
    const profile = await requireAdmin(['super_admin','admin','competition_manager','official','staff'])
    const body = await request.json()
    const matchId = String(body.matchId ?? '')
    const courtId = String(body.courtId ?? '')
    const scheduledStart = String(body.scheduledStart ?? '')
    const durationMinutes = Number(body.durationMinutes ?? 75)
    if (!matchId || !courtId || !scheduledStart) return NextResponse.json({error:'matchId, courtId and scheduledStart are required.'},{status:400})
    const start = new Date(scheduledStart)
    const end = new Date(start.getTime() + durationMinutes * 60000)
    if (Number.isNaN(start.getTime()) || durationMinutes <= 0) return NextResponse.json({error:'Invalid schedule.'},{status:400})
    const supabase = await createClient()
    if (!supabase) return NextResponse.json({error:'Supabase is not configured.'},{status:503})
    const {data: match, error: matchError} = await supabase.from('matches').select('id,player_a_id,player_b_id').eq('id',matchId).single()
    if (matchError || !match) return NextResponse.json({error:matchError?.message ?? 'Match not found.'},{status:404})
    const {data: conflicts, error: conflictError} = await supabase.from('match_schedule').select('match_id,court_id,scheduled_start,scheduled_end,matches(player_a_id,player_b_id)').not('schedule_status','eq','cancelled').lt('scheduled_start',end.toISOString()).gt('scheduled_end',start.toISOString())
    if (conflictError) return NextResponse.json({error:conflictError.message},{status:400})
    const conflict = (conflicts ?? []).find((row:any) => row.match_id !== matchId && (row.court_id === courtId || [match.player_a_id,match.player_b_id].filter(Boolean).some((p)=>[row.matches?.player_a_id,row.matches?.player_b_id].includes(p))))
    if (conflict) return NextResponse.json({error:'Court or player scheduling conflict detected.',conflictMatchId:conflict.match_id},{status:409})
    const payload = {match_id:matchId,court_id:courtId,scheduled_start:start.toISOString(),scheduled_end:end.toISOString(),schedule_status:'scheduled',updated_by:profile.id,updated_at:new Date().toISOString()}
    const {error} = await supabase.from('match_schedule').upsert(payload,{onConflict:'match_id'})
    if (error) return NextResponse.json({error:error.message},{status:400})
    const {error: matchUpdate} = await supabase.from('matches').update({scheduled_at:start.toISOString(),court:body.courtName ?? null,live_status:'scheduled'}).eq('id',matchId)
    if (matchUpdate) return NextResponse.json({error:matchUpdate.message},{status:400})
    await supabase.from('audit_logs').insert({actor_id:profile.id,action:'match.schedule_assigned',entity_type:'match',entity_id:matchId,metadata:{court_id:courtId,scheduled_start:start.toISOString(),scheduled_end:end.toISOString()}})
    return NextResponse.json({matchId,courtId,scheduledStart:start.toISOString(),scheduledEnd:end.toISOString()})
  } catch (error:any) { return NextResponse.json({error:error?.message ?? 'Unable to assign schedule.'},{status:400}) }
}
