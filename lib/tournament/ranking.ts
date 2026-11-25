export type MatchResult = {
  playerId: string
  opponentId: string
  won: boolean
  roundNumber: number
}

export type RankingRule = {
  participation: number
  win: number
  roundBonus: Record<number, number>
}

export function calculateRankingPoints(results: MatchResult[], rule: RankingRule) {
  const totals = new Map<string, number>()
  for (const result of results) {
    const current = totals.get(result.playerId) ?? 0
    const points = rule.participation + (result.won ? rule.win : 0) + (rule.roundBonus[result.roundNumber] ?? 0)
    totals.set(result.playerId, current + points)
  }
  return [...totals.entries()].map(([playerId, points]) => ({ playerId, points })).sort((a, b) => b.points - a.points || a.playerId.localeCompare(b.playerId))
}
