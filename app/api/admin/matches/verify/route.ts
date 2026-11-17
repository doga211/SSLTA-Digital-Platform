import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { validateCompletedScore } from '@/lib/tournament/scoring'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const profile = await requireAdmin(['super_admin', 'admin', 'competition_manager', 'official', 'staff'])
    const body = await request.json()
    const matchId = String(body.matchId ?? '')
    const scoreA = String(body.scoreA ?? '')
    const scoreB = String(body.scoreB ?? '')
    if (!matchId || !scoreA || !scoreB) return NextResponse.json({ error: 'matchId, scoreA and scoreB are required.' }, { status: 400 })

    const parsed = validateCompletedScore(scoreA, scoreB)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('id, tournament_id, draw_id, round_number, player_a_id, player_b_id, result_status, next_match_id, next_slot')
      .eq('id', matchId)
      .single()
    if (matchError || !match) return NextResponse.json({ error: matchError?.message ?? 'Match not found' }, { status: 404 })
    if (!match.player_a_id || !match.player_b_id) return NextResponse.json({ error: 'Both players must be present before a result can be verified.' }, { status: 400 })
    if (match.result_status === 'verified') return NextResponse.json({ error: 'This result is already verified.' }, { status: 409 })

    const winnerId = parsed.winnerSide === 'A' ? match.player_a_id : match.player_b_id
    const loserId = parsed.winnerSide === 'A' ? match.player_b_id : match.player_a_id
    const { error: updateError } = await supabase.from('matches').update({
      score_a: scoreA,
      score_b: scoreB,
      score_detail: parsed.sets,
      winner_id: winnerId,
      status: 'completed',
      result_status: 'verified',
      verified_at: new Date().toISOString(),
      verified_by: profile.id,
      ranking_eligible: true,
    }).eq('id', matchId)
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 })

    if (match.next_match_id && match.next_slot) {
      const field = match.next_slot === 'A' ? 'player_a_id' : 'player_b_id'
      const { error: advanceError } = await supabase.from('matches').update({ [field]: winnerId }).eq('id', match.next_match_id)
      if (advanceError) return NextResponse.json({ error: `Result verified, but progression update failed: ${advanceError.message}` }, { status: 500 })
    }

    await supabase.from('audit_logs').insert({
      actor_id: profile.id,
      action: 'match.result_verified',
      entity_type: 'match',
      entity_id: matchId,
      metadata: { winner_id: winnerId, loser_id: loserId, score_a: scoreA, score_b: scoreB },
    })

    return NextResponse.json({ matchId, winnerId, loserId, rankingEligible: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Unable to verify result.' }, { status: 400 })
  }
}
