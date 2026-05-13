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
    pontos: 3,
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
    pontos: 8,
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
    pontos: 8,
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
    pontos: 3,
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
    pontos: 1,
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
    pontos: 1,
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
    pontos: 3,
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
    pontos: 1,
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
    pontos: 3,
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
    pontos: 1,
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
    pontos: 3,
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
    pontos: 8,
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
    pontos: 1,
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
    pontos: 1,
    developmentTime: '2 horas',
    checklists: [
      { id: 'cl-done-2-1', text: 'Feedback coletado', done: true },
      { id: 'cl-done-2-2', text: 'Backlog de melhorias criado', done: true },
    ],
    comments: [],
    status: asStatus('done'),
  },

  {
    id: 'meta-done-stack',
    title: '[Feito] Shell React + Vite + Tailwind',
    description:
      'App.tsx com fluxo Login/Cadastro/Home; tema consistente; sem backend.',
    assignee: 'Front',
    difficulty: 'Baixa',
    pontos: 1,
    developmentTime: '—',
    checklists: [
      { id: 'cl-meta-stack-1', text: 'Vite + TS configurados', done: true },
      { id: 'cl-meta-stack-2', text: 'Tailwind + layout Home/Board', done: true },
    ],
    comments: [],
    status: asStatus('done'),
  },
  {
    id: 'meta-done-kanban',
    title: '[Feito] Quadro Kanban + DnD entre colunas',
    description:
      'Colunas por ColumnStatus; Board/Column/Card; @dnd-kit atualiza status ao soltar; useKanban em memória.',
    assignee: 'Front',
    difficulty: 'Média',
    pontos: 3,
    developmentTime: '—',
    checklists: [
      { id: 'cl-meta-kanban-1', text: '7 colunas + cards filtrados por status', done: true },
      { id: 'cl-meta-kanban-2', text: 'Drag entre colunas (sem position)', done: true },
    ],
    comments: [],
    status: asStatus('done'),
  },
  {
    id: 'meta-done-paineis',
    title: '[Feito] Painéis + sprint local (snapshot)',
    description:
      'ManagementPanels com métricas e histórico; Complete Sprint e Novo quadro só no estado local.',
    assignee: 'Front',
    difficulty: 'Média',
    pontos: 3,
    developmentTime: '—',
    checklists: [
      { id: 'cl-meta-painel-1', text: 'completedSprints + UI de sprints', done: true },
      { id: 'cl-meta-painel-2', text: 'Sem persistência no servidor', done: true },
    ],
    comments: [],
    status: asStatus('done'),
  },
  {
    id: 'meta-dev-api',
    title: '[Em andamento] Integrar API de cards e sprint',
    description:
      'Substituir useKanban local por GET/PATCH/move + endpoints de workspace e sprint; loading/erro/toast.',
    assignee: 'Full-stack',
    difficulty: 'Alta',
    pontos: 8,
    developmentTime: 'várias iterações',
    checklists: [
      { id: 'cl-meta-api-1', text: 'Cliente HTTP + tipos alinhados ao backend', done: false },
      { id: 'cl-meta-api-2', text: 'Sincronizar Complete Sprint / Blank board', done: false },
    ],
    comments: [],
    status: asStatus('inDev'),
  },
  {
    id: 'meta-dev-workspace',
    title: '[Em andamento] Workspace ativo (workspaceId)',
    description:
      'Front não tem workspace hoje; precisa resolver/criar workspace e passar workspaceId em todas as chamadas.',
    assignee: 'Full-stack',
    difficulty: 'Alta',
    pontos: 8,
    developmentTime: '—',
    checklists: [
      { id: 'cl-meta-ws-1', text: 'GET/POST workspaces + estado global', done: false },
      { id: 'cl-meta-ws-2', text: 'Cards sempre com workspace_id', done: false },
    ],
    comments: [],
    status: asStatus('inDev'),
  },
  {
    id: 'meta-backlog-busca',
    title: '[A fazer] Busca do header funcional',
    description:
      'Campo de busca em Home só é UI; falta filtrar cards no client ou GET .../search?q=.',
    assignee: 'Front',
    difficulty: 'Baixa',
    pontos: 1,
    developmentTime: '2–4 h',
    checklists: [
      { id: 'cl-meta-busca-1', text: 'Definir contrato com backend', done: false },
      { id: 'cl-meta-busca-2', text: 'Estado de filtro ou debounce na API', done: false },
    ],
    comments: [],
    status: asStatus('backlog'),
  },
  {
    id: 'meta-backlog-position',
    title: '[A fazer] Ordem dentro da coluna (position)',
    description:
      'Backend pode ter position; front hoje não reordena na mesma coluna nem envia índice.',
    assignee: 'Front',
    difficulty: 'Alta',
    pontos: 8,
    developmentTime: '—',
    checklists: [
      { id: 'cl-meta-pos-1', text: 'Sort por position no render', done: false },
      { id: 'cl-meta-pos-2', text: 'DnD intra-coluna + POST move', done: false },
    ],
    comments: [],
    status: asStatus('backlog'),
  },
  {
    id: 'meta-planned-auth',
    title: '[Planejado] Auth real (JWT) e papéis',
    description:
      'Trocar nome em localStorage por login seguro, convites e regras por plano (admin/coordenador).',
    assignee: 'Back + Front',
    difficulty: 'Alta',
    pontos: 8,
    developmentTime: '—',
    checklists: [
      { id: 'cl-meta-auth-1', text: 'Login/register na API', done: false },
      { id: 'cl-meta-auth-2', text: 'Guardar token e refresh', done: false },
    ],
    comments: [],
    status: asStatus('planned'),
  },
  {
    id: 'meta-planned-termo',
    title: '[Planejado] Termo de uso e planos na UI',
    description:
      'Publicar TERMO_DE_USO_KANFLOW.md no app; aceite; limites Free/Básico/Full conforme negócio.',
    assignee: 'Produto + Front',
    difficulty: 'Média',
    pontos: 3,
    developmentTime: '—',
    checklists: [
      { id: 'cl-meta-termo-1', text: 'Modal ou página /termos', done: false },
      { id: 'cl-meta-termo-2', text: 'Checkbox no cadastro', done: false },
    ],
    comments: [],
    status: asStatus('planned'),
  },
]

