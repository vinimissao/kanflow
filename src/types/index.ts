export type ColumnStatus =
  | 'backlog'
  | 'planned'
  | 'readyForDev'
  | 'inDev'
  | 'codeReview'
  | 'inTest'
  | 'done'

export type CardDifficulty = 'Baixa' | 'Média' | 'Alta'

export type ChecklistItem = {
  id: string
  text: string
  done: boolean
}

export type CardComment = {
  id: string
  text: string
  createdAt: number // unix ms
}

export type KanbanCard = {
  id: string
  title: string
  description: string
  assignee: string
  difficulty: CardDifficulty
  checklists: ChecklistItem[]
  developmentTime: string
  comments: CardComment[]
  status: ColumnStatus
}

export type KanbanColumn = {
  status: ColumnStatus
  title: string
}

