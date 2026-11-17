export type ScheduledMatch = {
  matchId: string
  courtId: string
  start: Date
  end: Date
  playerAId?: string | null
  playerBId?: string | null
}

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd
}

export function hasPlayerConflict(candidate: ScheduledMatch, existing: ScheduledMatch[]) {
  return existing.some((item) => {
    if (item.courtId === candidate.courtId && overlaps(candidate.start, candidate.end, item.start, item.end)) return true
    if (!overlaps(candidate.start, candidate.end, item.start, item.end)) return false
    return Boolean(candidate.playerAId && [item.playerAId, item.playerBId].includes(candidate.playerAId)) ||
      Boolean(candidate.playerBId && [item.playerAId, item.playerBId].includes(candidate.playerBId))
  })
}

export function buildSchedule(start: Date, courtIds: string[], matchIds: string[], durationMinutes = 75, bufferMinutes = 15) {
  if (!courtIds.length) throw new Error('At least one active court is required.')
  const output: Array<{matchId: string; courtId: string; start: string; end: string; queuePosition: number}> = []
  let cursor = new Date(start)
  for (let i = 0; i < matchIds.length; i++) {
    const courtId = courtIds[i % courtIds.length]
    const matchStart = new Date(cursor)
    const matchEnd = new Date(matchStart.getTime() + durationMinutes * 60000)
    output.push({ matchId: matchIds[i], courtId, start: matchStart.toISOString(), end: matchEnd.toISOString(), queuePosition: i + 1 })
    cursor = new Date(matchEnd.getTime() + bufferMinutes * 60000)
  }
  return output
}
