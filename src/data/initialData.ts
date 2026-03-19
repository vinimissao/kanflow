import type { KanbanCard, KanbanColumn, ColumnStatus } from '../types'

export const columns: KanbanColumn[] = [
  { status: 'backlog', title: 'Backlog' },
  { status: 'planned', title: 'Planejado' },
  { status: 'readyForDev', title: 'Pronto para Dev' },
  { status: 'inDev', title: 'Em Dev' },
  { status: 'codeReview', title: 'Revisão de Código' },
  { status: 'inTest', title: 'Em Teste' },
  { status: 'done', title: 'Concluído' },
]

const asStatus = (status: ColumnStatus) => status

export const initialCards: KanbanCard[] = [
  {
    id: 'card-login-1',
    title: 'Criar login',
    description: 'Implementar tela de login e validação básica de formulário.',
    assignee: 'Rosa',
    status: asStatus('backlog'),
  },
  {
    id: 'card-login-2',
    title: 'Recuperar senha',
    description: 'Criar fluxo de recuperação por e-mail e mensagens de feedback.',
    assignee: 'Diego',
    status: asStatus('backlog'),
  },

  {
    id: 'card-api-1',
    title: 'Integrar API',
    description: 'Conectar endpoints principais e padronizar tratamento de erros.',
    assignee: 'Vanessa',
    status: asStatus('planned'),
  },
  {
    id: 'card-api-2',
    title: 'Contrato de dados',
    description: 'Definir tipos e modelos para requests/responses.',
    assignee: 'Lucas',
    status: asStatus('planned'),
  },

  {
    id: 'card-kanban-1',
    title: 'Modelar Kanban',
    description: 'Definir estados do card e regras de movimento entre colunas.',
    assignee: 'Ana',
    status: asStatus('readyForDev'),
  },
  {
    id: 'card-kanban-2',
    title: 'Design do quadro',
    description: 'Ajustar estilo (sombra, bordas arredondadas e layout responsivo).',
    assignee: 'Marcos',
    status: asStatus('readyForDev'),
  },

  {
    id: 'card-dnd-1',
    title: 'Drag and drop',
    description: 'Permitir arrastar cards entre colunas e atualizar status ao soltar.',
    assignee: 'Paula',
    status: asStatus('inDev'),
  },
  {
    id: 'card-dnd-2',
    title: 'Experiência de arraste',
    description: 'Adicionar highlight na coluna e placeholder durante o drag.',
    assignee: 'Henrique',
    status: asStatus('inDev'),
  },

  {
    id: 'card-review-1',
    title: 'Revisão de componentes',
    description: 'Validar responsividade e padrões de componentes (Board/Column/Card).',
    assignee: 'Carla',
    status: asStatus('codeReview'),
  },
  {
    id: 'card-review-2',
    title: 'Revisar tipagem',
    description: 'Garantir que tipos (status, cards) estejam consistentes e seguros.',
    assignee: 'Rafael',
    status: asStatus('codeReview'),
  },

  {
    id: 'card-test-1',
    title: 'Testes manuais',
    description: 'Verificar fluxo do Kanban em desktop e no modo responsivo.',
    assignee: 'João',
    status: asStatus('inTest'),
  },
  {
    id: 'card-test-2',
    title: 'Edge cases',
    description: 'Testar arraste rápido, soltar fora e comportamento em colunas vazias.',
    assignee: 'Bianca',
    status: asStatus('inTest'),
  },

  {
    id: 'card-done-1',
    title: 'Deploy inicial',
    description: 'Publicar versão estável do quadro Kanban no ambiente de testes.',
    assignee: 'Vanessa',
    status: asStatus('done'),
  },
  {
    id: 'card-done-2',
    title: 'Feedback do time',
    description: 'Coletar feedback e planejar melhorias para o próximo ciclo.',
    assignee: 'Diego',
    status: asStatus('done'),
  },
]

