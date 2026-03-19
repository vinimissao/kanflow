export type ColumnStatus =
  | 'backlog'
  | 'planned'
  | 'readyForDev'
  | 'inDev'
  | 'codeReview'
  | 'inTest'
  | 'done'

export type KanbanCard = {
  id: string
  title: string
  description: string
  assignee: string
  status: ColumnStatus
}

export type KanbanColumn = {
  status: ColumnStatus
  title: string
}

