import type { CardDifficulty, FibonacciPoints } from '../types'

export const FIBONACCI_PONTOS: readonly FibonacciPoints[] = [1, 2, 3, 5, 8, 13]

export function normalizeFibonacciPoints(v: unknown): FibonacciPoints {
  const n = typeof v === 'number' && !Number.isNaN(v) ? v : Number.parseInt(String(v ?? ''), 10)
  if (FIBONACCI_PONTOS.includes(n as FibonacciPoints)) return n as FibonacciPoints
  return 3
}

export function difficultyToPontos(d: CardDifficulty): FibonacciPoints {
  if (d === 'Baixa') return 1
  if (d === 'Alta') return 8
  return 3
}

export function pontosToDifficulty(p: FibonacciPoints): CardDifficulty {
  if (p <= 2) return 'Baixa'
  if (p >= 8) return 'Alta'
  return 'Média'
}

export function nearestFibonacciPoints(n: number): FibonacciPoints {
  const seq = FIBONACCI_PONTOS
  let best = seq[0]
  let bestDist = Math.abs(n - best)
  for (const p of seq) {
    const d = Math.abs(n - p)
    if (d < bestDist) {
      best = p
      bestDist = d
    }
  }
  return best
}
