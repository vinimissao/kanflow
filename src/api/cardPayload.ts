import type { FibonacciPoints, KanbanCard } from '../types'
import { parseTempoEstimadoHoras } from './tempoEstimado'

export function cardToFullApiBody(
  card: KanbanCard,
  workspaceId: string,
  posicao = 0,
): Record<string, unknown> {
  const horas = parseTempoEstimadoHoras(card.developmentTime)
  return {
    titulo: card.title,
    descricao: card.description?.trim() || null,
    pontos: card.pontos,
    tempoEstimado: horas > 0 ? horas : null,
    status: card.status,
    responsavelId: null,
    workspaceId,
    posicao,
    assignee: card.assignee?.trim() || null,
  }
}
