/** Converte texto do formulário ("8 horas", "12") em número para `tempoEstimado` na API. */
export function parseTempoEstimadoHoras(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  const digits = trimmed.match(/\d+/)
  if (digits) {
    const n = parseInt(digits[0], 10)
    if (!Number.isNaN(n) && n >= 0) return n
  }
  return 0
}
