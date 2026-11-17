import { parseScore } from './engine'

export function validateCompletedScore(scoreA: string, scoreB: string) {
  const parsed = parseScore(scoreA, scoreB)
  return parsed
}

export function winnerFromScore(playerAId: string, playerBId: string, scoreA: string, scoreB: string) {
  const parsed = parseScore(scoreA, scoreB)
  return parsed.winnerSide === 'A' ? playerAId : playerBId
}
