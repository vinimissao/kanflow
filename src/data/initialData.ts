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

const now = Date.now()

export const initialCards: KanbanCard[] = [
  {
    id: 'card-login-1',
    title: 'Criar login',
    description: 'Implementar tela de login e validação básica de formulário.',
    assignee: 'Rosa',
    difficulty: 'Média',
    developmentTime: '3 horas',
    checklists: [
      { id: 'cl-login-1-1', text: 'Tela de login criada', done: true },
      { id: 'cl-login-1-2', text: 'Validações básicas implementadas', done: false },
    ],
    comments: [
      {
        id: 'cm-login-1-1',
        text: 'A validação do e-mail pode ser refinada depois.',
        createdAt: now - 1000 * 60 * 60 * 18,
      },
    ],
    status: asStatus('backlog'),
  },
  {
    id: 'card-login-2',
    title: 'Recuperar senha',
    description: 'Criar fluxo de recuperação por e-mail e mensagens de feedback.',
    assignee: 'Diego',
    difficulty: 'Alta',
    developmentTime: '6 horas',
    checklists: [
      { id: 'cl-login-2-1', text: 'Fluxo de recuperação desenhado', done: true },
      { id: 'cl-login-2-2', text: 'Enviar e-mail e mensagens de feedback', done: false },
    ],
    comments: [],
    status: asStatus('backlog'),
  },

  {
    id: 'card-api-1',
    title: 'Integrar API',
    description: 'Conectar endpoints principais e padronizar tratamento de erros.',
    assignee: 'Vanessa',
    difficulty: 'Alta',
    developmentTime: '5 horas',
    checklists: [
      { id: 'cl-api-1-1', text: 'Endpoints conectados', done: false },
      { id: 'cl-api-1-2', text: 'Tratamento de erros padronizado', done: false },
    ],
    comments: [
      {
        id: 'cm-api-1-1',
        text: 'Verificar mensagens consistentes para o front.',
        createdAt: now - 1000 * 60 * 60 * 6,
      },
    ],
    status: asStatus('planned'),
  },
  {
    id: 'card-api-2',
    title: 'Contrato de dados',
    description: 'Definir tipos e modelos para requests/responses.',
    assignee: 'Lucas',
    difficulty: 'Média',
    developmentTime: '4 horas',
    checklists: [
      { id: 'cl-api-2-1', text: 'Modelos de request definidos', done: true },
      { id: 'cl-api-2-2', text: 'Modelos de response definidos', done: false },
    ],
    comments: [],
    status: asStatus('planned'),
  },

  {
    id: 'card-kanban-1',
    title: 'Modelar Kanban',
    description: 'Definir estados do card e regras de movimento entre colunas.',
    assignee: 'Ana',
    difficulty: 'Baixa',
    developmentTime: '2 horas',
    checklists: [
      { id: 'cl-kanban-1-1', text: 'Estados mapeados', done: true },
      { id: 'cl-kanban-1-2', text: 'Regras de movimento definidas', done: true },
    ],
    comments: [
      { id: 'cm-kanban-1-1', text: 'Ok para seguir com a UI.', createdAt: now - 1000 * 60 * 60 * 26 },
    ],
    status: asStatus('readyForDev'),
  },
  {
    id: 'card-kanban-2',
    title: 'Design do quadro',
    description: 'Ajustar estilo (sombra, bordas arredondadas e layout responsivo).',
    assignee: 'Marcos',
    difficulty: 'Baixa',
    developmentTime: '2 horas',
    checklists: [
      { id: 'cl-kanban-2-1', text: 'Estilo aplicado nos containers', done: true },
      { id: 'cl-kanban-2-2', text: 'Responsividade conferida', done: false },
    ],
    comments: [],
    status: asStatus('readyForDev'),
  },

  {
    id: 'card-dnd-1',
    title: 'Drag and drop',
    description: 'Permitir arrastar cards entre colunas e atualizar status ao soltar.',
    assignee: 'Paula',
    difficulty: 'Média',
    developmentTime: '3 horas',
    checklists: [
      { id: 'cl-dnd-1-1', text: 'Implementar drag', done: true },
      { id: 'cl-dnd-1-2', text: 'Atualizar status ao soltar', done: false },
    ],
    comments: [],
    status: asStatus('inDev'),
  },
  {
    id: 'card-dnd-2',
    title: 'Experiência de arraste',
    description: 'Adicionar highlight na coluna e placeholder durante o drag.',
    assignee: 'Henrique',
    difficulty: 'Baixa',
    developmentTime: '1 hora',
    checklists: [
      { id: 'cl-dnd-2-1', text: 'Highlight na coluna', done: true },
      { id: 'cl-dnd-2-2', text: 'Placeholder durante o drag', done: false },
    ],
    comments: [],
    status: asStatus('inDev'),
  },

  {
    id: 'card-review-1',
    title: 'Revisão de componentes',
    description: 'Validar responsividade e padrões de componentes (Board/Column/Card).',
    assignee: 'Carla',
    difficulty: 'Média',
    developmentTime: '2 horas',
    checklists: [
      { id: 'cl-review-1-1', text: 'Responsividade conferida', done: false },
      { id: 'cl-review-1-2', text: 'Padrões aplicados', done: false },
    ],
    comments: [],
    status: asStatus('codeReview'),
  },
  {
    id: 'card-review-2',
    title: 'Revisar tipagem',
    description: 'Garantir que tipos (status, cards) estejam consistentes e seguros.',
    assignee: 'Rafael',
    difficulty: 'Baixa',
    developmentTime: '1 hora',
    checklists: [
      { id: 'cl-review-2-1', text: 'Tipos de card conferidos', done: true },
      { id: 'cl-review-2-2', text: 'Erros de TS resolvidos', done: false },
    ],
    comments: [],
    status: asStatus('codeReview'),
  },

  {
    id: 'card-test-1',
    title: 'Testes manuais',
    description: 'Verificar fluxo do Kanban em desktop e no modo responsivo.',
    assignee: 'João',
    difficulty: 'Média',
    developmentTime: '2 horas',
    checklists: [
      { id: 'cl-test-1-1', text: 'Fluxo conferido no desktop', done: false },
      { id: 'cl-test-1-2', text: 'Fluxo conferido no responsivo', done: false },
    ],
    comments: [],
    status: asStatus('inTest'),
  },
  {
    id: 'card-test-2',
    title: 'Edge cases',
    description: 'Testar arraste rápido, soltar fora e comportamento em colunas vazias.',
    assignee: 'Bianca',
    difficulty: 'Alta',
    developmentTime: '3 horas',
    checklists: [
      { id: 'cl-test-2-1', text: 'Arraste rápido testado', done: false },
      { id: 'cl-test-2-2', text: 'Colunas vazias testadas', done: false },
    ],
    comments: [],
    status: asStatus('inTest'),
  },

  {
    id: 'card-done-1',
    title: 'Deploy inicial',
    description: 'Publicar versão estável do quadro Kanban no ambiente de testes.',
    assignee: 'Vanessa',
    difficulty: 'Baixa',
    developmentTime: '1 hora',
    checklists: [
      { id: 'cl-done-1-1', text: 'Build executado', done: true },
      { id: 'cl-done-1-2', text: 'Deploy realizado', done: true },
    ],
    comments: [{ id: 'cm-done-1-1', text: 'Pronto para o próximo ciclo.', createdAt: now - 1000 * 60 * 60 * 72 }],
    status: asStatus('done'),
  },
  {
    id: 'card-done-2',
    title: 'Feedback do time',
    description: 'Coletar feedback e planejar melhorias para o próximo ciclo.',
    assignee: 'Diego',
    difficulty: 'Baixa',
    developmentTime: '2 horas',
    checklists: [
      { id: 'cl-done-2-1', text: 'Feedback coletado', done: true },
      { id: 'cl-done-2-2', text: 'Backlog de melhorias criado', done: true },
    ],
    comments: [],
    status: asStatus('done'),
  },
]

