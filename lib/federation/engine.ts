export type Entrant = {
  registrationId: string
  playerId: string
  playerName: string
  seed?: number | null
}

export type DrawSlot = {
  position: number
  registrationId: string | null
  playerId: string | null
  playerName: string | null
  seed: number | null
  isBye: boolean
}

export type DrawMatch = {
  roundNumber: number
  roundName: string
  matchNumber: number
  slotA: number
  slotB: number
  playerAId: string | null
  playerBId: string | null
  winnerId: string | null
}

export type ParsedScore = {
  sets: Array<[number, number]>
  winnerSide: 'A' | 'B'
}

export function nextPowerOfTwo(value: number) {
  let size = 1
  while (size < Math.max(2, value)) size *= 2
  return size
}

function roundName(roundNumber: number, totalRounds: number) {
  const fromEnd = totalRounds - roundNumber
  if (fromEnd === 0) return 'Final'
  if (fromEnd === 1) return 'Semifinal'
  if (fromEnd === 2) return 'Quarterfinal'
  return `Round ${roundNumber}`
}

/** Standard single-elimination placement: seeds are distributed to reduce seeded collisions. */
export function placeSeeds(entries: Entrant[], size: number): DrawSlot[] {
  const ordered = [...entries].sort((a, b) => {
    const sa = a.seed ?? Number.MAX_SAFE_INTEGER
    const sb = b.seed ?? Number.MAX_SAFE_INTEGER
    return sa - sb || a.playerName.localeCompare(b.playerName)
  })
  const positions = Array.from({ length: size }, (_, i) => i + 1)
  const slots: Array<Entrant | null> = Array(size).fill(null)

  // Recursive seed placement: 1 vs 2 are placed in opposite halves, then each split repeats.
  const seedPositions = (n: number): number[] => {
    if (n === 1) return [1]
    const previous = seedPositions(n / 2)
    const result: number[] = []
    for (const p of previous) result.push(p, n + 1 - p)
    return result
  }
  const placement = seedPositions(size)
  const seeded = ordered.filter((e) => e.seed).sort((a, b) => (a.seed as number) - (b.seed as number))
  seeded.forEach((entry, index) => {
    const position = placement[index]
    if (position) slots[position - 1] = entry
  })

  // Unseeded entrants fill remaining slots deterministically.
  const unseeded = ordered.filter((e) => !e.seed).sort((a, b) => a.playerName.localeCompare(b.playerName))
  let cursor = 0
  for (let i = 0; i < size; i++) {
    if (!slots[i] && cursor < unseeded.length) slots[i] = unseeded[cursor++]
  }

  return positions.map((position, index) => {
    const entry = slots[index]
    return {
      position,
      registrationId: entry?.registrationId ?? null,
      playerId: entry?.playerId ?? null,
      playerName: entry?.playerName ?? null,
      seed: entry?.seed ?? null,
      isBye: !entry,
    }
  })
}

export function generateKnockout(entries: Entrant[]) {
  const size = nextPowerOfTwo(entries.length)
  const slots = placeSeeds(entries, size)
  const totalRounds = Math.log2(size)
  const matches: DrawMatch[] = []

  let previousCount = size / 2
  for (let round = 1; round <= totalRounds; round++) {
    for (let match = 1; match <= previousCount; match++) {
      const slotA = round === 1 ? (match - 1) * 2 + 1 : null
      const slotB = round === 1 ? (match - 1) * 2 + 2 : null
      matches.push({
        roundNumber: round,
        roundName: roundName(round, totalRounds),
        matchNumber: match,
        slotA: slotA ?? 0,
        slotB: slotB ?? 0,
        playerAId: round === 1 ? slots[(match - 1) * 2]?.playerId ?? null : null,
        playerBId: round === 1 ? slots[(match - 1) * 2 + 1]?.playerId ?? null : null,
        winnerId: round === 1 ? autoByeWinner(slots[(match - 1) * 2]?.playerId ?? null, slots[(match - 1) * 2 + 1]?.playerId ?? null) : null,
      })
    }
    previousCount = Math.max(1, previousCount / 2)
  }
  return { size, totalRounds, slots, matches }
}

function autoByeWinner(a: string | null, b: string | null) {
  if (a && !b) return a
  if (!a && b) return b
  return null
}

export function parseScore(scoreA: string, scoreB: string): ParsedScore {
  const tokensA = scoreA.trim().split(/\s+/)
  const tokensB = scoreB.trim().split(/\s+/)
  if (!tokensA.length || tokensA.length !== tokensB.length) throw new Error('Scores must contain the same number of sets.')
  const sets: Array<[number, number]> = []
  let winsA = 0
  let winsB = 0
  for (let i = 0; i < tokensA.length; i++) {
    const a = Number(tokensA[i]); const b = Number(tokensB[i])
    if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0 || a === b) throw new Error('Each set must contain two non-negative, unequal integers.')
    sets.push([a, b])
    if (a > b) winsA++; else winsB++
  }
  if (winsA === winsB) throw new Error('A completed match must have one winner.')
  return { sets, winnerSide: winsA > winsB ? 'A' : 'B' }
}

export type RankingPointRule = { winner: number; loser: number; round: number }
export function calculateMatchPoints(winner: RankingPointRule, loser: RankingPointRule) {
  return { winnerPoints: winner.winner + winner.round, loserPoints: loser.loser }
}
