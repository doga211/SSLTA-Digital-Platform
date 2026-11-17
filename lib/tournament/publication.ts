import { createHash } from 'crypto'

export function stableSnapshotChecksum(snapshot: unknown) {
  return createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')
}

export function rankSnapshot(rows: Array<{playerId: string; playerName: string; points: number}>) {
  return [...rows].sort((a, b) => b.points - a.points || a.playerName.localeCompare(b.playerName)).map((row, index) => ({...row, position: index + 1}))
}
