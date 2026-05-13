export type ColumnStatus =
  | 'backlog'
  | 'planned'
  | 'readyForDev'
  | 'inDev'
  | 'codeReview'
  | 'inTest'
  | 'done'

export type CardDifficulty = 'Baixa' | 'Média' | 'Alta'

export type FibonacciPoints = 1 | 2 | 3 | 5 | 8 | 13

export type ChecklistItem = {
  id: string
  text: string
  done: boolean
}

export type CardComment = {
  id: string
  text: string
  createdAt: number
}

export type KanbanCard = {
  id: string
  title: string
  description: string
  assignee: string
  difficulty: CardDifficulty
  pontos: FibonacciPoints
  checklists: ChecklistItem[]
  developmentTime: string
  comments: CardComment[]
  status: ColumnStatus
}

export type KanbanColumn = {
  status: ColumnStatus
  title: string
}

export type CompletedSprintRecord = {
  id: string
  name: string
  endedAt: number
  startedAt?: number
  cards: KanbanCard[]
  cardsTotal?: number
  cardsDone?: number
  checklistTotal?: number
  checklistDone?: number
}

