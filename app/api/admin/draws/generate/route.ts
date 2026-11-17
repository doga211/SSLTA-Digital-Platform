import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth/require-admin'
import { generateKnockout, type Entrant } from '@/lib/tournament/engine'

const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function POST(request: Request) {
  try {
    const profile = await requireAdmin(['super_admin', 'admin', 'competition_manager'])
    const body = await request.json().catch(() => ({}))
    const categoryId = String(body.categoryId ?? '')
    if (!categoryId) return NextResponse.json({ error: 'categoryId is required' }, { status: 400 })

    const supabase = await createClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 })

    const { data: category, error: categoryError } = await supabase
      .from('tournament_categories')
      .select('id, name, tournament_id, format')
      .eq('id', categoryId)
      .single()
    if (categoryError || !category) return NextResponse.json({ error: categoryError?.message ?? 'Category not found' }, { status: 404 })
    if (category.format !== 'knockout') return NextResponse.json({ error: 'V2.3 currently generates single-elimination knockout draws.' }, { status: 400 })

    const { data: registrations, error: registrationError } = await supabase
      .from('tournament_registrations')
      .select('id, player_id, seed, eligibility_status, players(id, full_name)')
      .eq('tournament_category_id', categoryId)
      .in('eligibility_status', ['eligible', 'verified'])
      .order('seed', { ascending: true, nullsFirst: false })
    if (registrationError) return NextResponse.json({ error: registrationError.message }, { status: 400 })
    if (!registrations || registrations.length < 2) return NextResponse.json({ error: 'At least two eligible players are required.' }, { status: 400 })

    const entries: Entrant[] = registrations.map((r: any) => ({
      registrationId: r.id,
      playerId: r.player_id,
      playerName: r.players?.full_name ?? 'Player',
      seed: r.seed,
    }))
    const bracket = generateKnockout(entries)
    const drawId = randomUUID()

    const { error: drawError } = await supabase.from('draws').insert({
      id: drawId,
      tournament_category_id: categoryId,
      draw_type: 'knockout',
      draw_size: bracket.size,
      status: 'draft',
      generated_at: new Date().toISOString(),
      created_by: profile.id,
    })
    if (drawError) return NextResponse.json({ error: drawError.message }, { status: 400 })

    const slots = bracket.slots.map((slot) => ({
      draw_id: drawId,
      position: slot.position,
      registration_id: slot.registrationId,
      player_id: slot.playerId,
      seed: slot.seed,
      is_bye: slot.isBye,
    }))
    const { error: slotError } = await supabase.from('draw_slots').insert(slots)
    if (slotError) return NextResponse.json({ error: slotError.message }, { status: 400 })

    const rounds: any[][] = []
    let count = bracket.size / 2
    for (let round = 1; round <= bracket.totalRounds; round++) {
      rounds.push(Array.from({ length: count }, (_, i) => ({ round, number: i + 1, id: randomUUID() })))
      count = Math.max(1, count / 2)
    }

    const records: any[] = []
    for (const round of rounds) {
      for (const m of round) {
        const next = rounds[m.round]
        const nextMatch = next ? next[Math.floor((m.number - 1) / 2)] : null
        const nextSlot = m.number % 2 === 1 ? 'A' : 'B'
        const firstRound = m.round === 1
        const a = firstRound ? bracket.matches.find((x) => x.roundNumber === 1 && x.matchNumber === m.number)?.playerAId ?? null : null
        const b = firstRound ? bracket.matches.find((x) => x.roundNumber === 1 && x.matchNumber === m.number)?.playerBId ?? null : null
        const bye = firstRound && ((a && !b) || (!a && b))
        records.push({
          id: m.id,
          tournament_id: category.tournament_id,
          draw_id: drawId,
          round_name: bracket.matches.find((x) => x.roundNumber === m.round && x.matchNumber === m.number)?.roundName ?? `Round ${m.round}`,
          round_number: m.round,
          match_number: m.number,
          player_a_id: a,
          player_b_id: b,
          winner_id: bye ? (a ?? b) : null,
          status: bye ? 'completed' : 'scheduled',
          result_status: bye ? 'bye' : 'pending',
          next_match_id: nextMatch?.id ?? null,
          next_slot: nextMatch ? nextSlot : null,
          ranking_eligible: false,
          score_detail: [],
        })
      }
    }

    // Propagate automatic BYEs forward through the bracket.
    for (let r = 1; r < rounds.length; r++) {
      for (const next of rounds[r]) {
        const target = records.find((x) => x.id === next.id)
        if (!target) continue
        const previous = records.filter((x) => x.next_match_id === next.id)
        const winners = previous.map((x) => x.winner_id).filter(Boolean)
        const hasPendingSource = previous.some((x) => !x.winner_id)
        if (winners[0]) target.player_a_id = winners[0]
        if (winners[1]) target.player_b_id = winners[1]
        if (!hasPendingSource && winners.length === 1) {
          target.winner_id = winners[0]
          target.status = 'completed'
          target.result_status = 'bye'
        } else if (Boolean(target.player_a_id) !== Boolean(target.player_b_id)) {
          target.winner_id = target.player_a_id ?? target.player_b_id
          target.status = 'completed'
          target.result_status = 'bye'
        }
      }
    }

    const { error: matchError } = await supabase.from('matches').insert(records)
    if (matchError) return NextResponse.json({ error: matchError.message }, { status: 400 })

    await supabase.from('audit_logs').insert({
      actor_id: profile.id,
      action: 'draw.generated',
      entity_type: 'draw',
      entity_id: drawId,
      metadata: { category_id: categoryId, draw_size: bracket.size, eligible_entries: entries.length },
    })

    return NextResponse.json({ drawId, drawSize: bracket.size, rounds: bracket.totalRounds, matches: records.length })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Unable to generate draw.' }, { status: 500 })
  }
}
