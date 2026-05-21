# Guia de API (front Kanflow)

Referência única: método, URL, body JSON e headers. O código que chama a API está em `src/api/` (wrapper `apiFetch` em `src/api/client.ts`).

## Base URL

| Ambiente | Base | Exemplo final |
|----------|------|----------------|
| **Dev com proxy (recomendado)** | `http://localhost:5173/api` | `http://localhost:5173/api/auth/login` |
| **Dev com URL absoluta** | `VITE_API_URL` + `/api` | `http://127.0.0.1:8080/api/auth/login` |

- Sem `VITE_API_URL` em dev: o front usa path **`/api`** no mesmo host do Vite (`:5173`). O Vite encaminha para o Spring (`vite.config.ts` → `VITE_PROXY_TARGET`, default `http://127.0.0.1:8080`).
- Com `VITE_API_URL=http://127.0.0.1:8080`: as chamadas vão direto para `http://127.0.0.1:8080/api/...` (CORS tem de estar ok no back).
- `VITE_DEMO_LOCAL=true`: API desligada (`getApiRoot()` vazio).

## Headers (regra geral)

| Situação | `Authorization` | `Content-Type` |
|----------|-----------------|----------------|
| **Register / Login** | omitir | `application/json` (há body JSON) |
| **Qualquer outro método** | `Bearer <accessToken>` | `application/json` **só se existir body JSON** |
| **POST sem body** (ex.: complete sprint, blank board, confirm-mock) | `Bearer` | **não** enviar `Content-Type: application/json` |

O `apiFetch` do projeto só define `Content-Type: application/json` quando a opção `json` é passada; requisições sem body não devem forçar esse header.

## Auth

### `POST /api/auth/register` — sem Bearer

**Body JSON:**

```json
{
  "nome": "Nome",
  "email": "mail@exemplo.com",
  "senha": "mínimo6",
  "perfil": "membro"
}
```

- `perfil`: `admin` | `membro`

### `POST /api/auth/login` — sem Bearer

**Body JSON:**

```json
{
  "email": "mail@exemplo.com",
  "senha": "mínimo6"
}
```

### `POST /api/auth/change-password` — com Bearer

**Body JSON:**

```json
{
  "senhaAtual": "mínimo6",
  "novaSenha": "mínimo6"
}
```

### `GET /api/auth/me` — com Bearer, sem body

---

## Billing / plano

### `GET /api/billing/plan` — com Bearer, sem body

### `POST /api/billing/checkout` — com Bearer

**Body JSON:**

```json
{
  "planType": "BASIC",
  "billingPeriod": "MONTHLY"
}
```

- `planType`: `BASIC` | `FULL`
- `billingPeriod`: `MONTHLY` | `YEARLY`

### `POST /api/billing/payments/{paymentId}/confirm-mock` — com Bearer, sem body

### `POST /api/billing/cancel` — com Bearer

**Body:** opcional. O front envia `{}` (JSON vazio) com `Content-Type: application/json` para compatibilidade com Spring; também pode ser POST sem corpo.

**Headers:** `Authorization: Bearer <token>`

**Respostas:**

- **200** — mesmo JSON que `GET /api/billing/plan` (`PlanStatusResponse`), ex.: `planType: "FREE"` após cancelar.
- **409 Conflict** — sem assinatura ativa (ex.: mensagem *"Não há assinatura ativa para cancelar."*).

**No Spring:** tem de existir um `@PostMapping` em `/api/billing/cancel`. Se não existir, pode aparecer erro tipo `No static resource api/billing/cancel` — o front trata e orienta contato por e-mail.

---

## Workspaces

### `POST /api/workspaces` — com Bearer

**Body JSON:**

```json
{
  "nome": "Meu projeto",
  "columns": [
    { "nome": "To Do", "ordem": 1 },
    { "nome": "Doing", "ordem": 2 }
  ]
}
```

- `columns`: pode ser `null` ou omitido (back usa padrão).

### `PUT /api/workspaces/{id}` — com Bearer

**Body JSON:**

```json
{
  "nome": "Novo nome"
}
```

### `PUT /api/workspaces/{id}/board` — com Bearer

**Body JSON:** array no root (não envolver em objeto):

```json
[
  { "nome": "Backlog", "ordem": 1 },
  { "nome": "Done", "ordem": 2 }
]
```

### `GET /api/workspaces` — com Bearer, sem body

### `GET /api/workspaces/{id}` — com Bearer, sem body

### `DELETE /api/workspaces/{id}` — com Bearer, sem body

### `GET /api/workspaces/{workspaceId}/board` — com Bearer, sem body

---

## Sprints do workspace (histórico / quadro)

### `POST /api/workspaces/{workspaceId}/sprints/complete` — com Bearer, **sem body**

### `POST /api/workspaces/{workspaceId}/board/blank` — com Bearer, **sem body** (resposta típica: 204)

### `GET /api/workspaces/{workspaceId}/sprints` — com Bearer, sem body

### `GET /api/workspaces/{workspaceId}/sprints/{sprintHistoryId}` — com Bearer, sem body

### Erro 500 em `sprints/complete`

O front envia `POST` **sem body** e **sem** `Content-Type: application/json` (só `Authorization: Bearer …`). Um **500** indica exceção **dentro do Spring** (NPE, transação, regra de negócio, etc.): corrija no handler que grava o snapshot / totais e só depois limpa o quadro. Em dev, o consola do browser regista `[apiFetch]` com o corpo da resposta; no IDE veja o stack trace do pedido a `.../sprints/complete`.

---

## Busca

### `GET /api/workspaces/{workspaceId}/search?q=texto` — com Bearer, sem body (só query `q`)

---

## Cards

### `GET /api/cards?workspaceId=uuid` — com Bearer, sem body (`workspaceId` query opcional)

### `POST /api/cards` — com Bearer

**Body JSON:**

```json
{
  "titulo": "Tarefa",
  "descricao": "opcional",
  "pontos": 5,
  "tempoEstimado": 8,
  "status": "backlog",
  "responsavelId": null,
  "workspaceId": "uuid-workspace",
  "posicao": 0,
  "assignee": null
}
```

- `pontos`: apenas `1`, `2`, `3`, `5`, `8`, `13`
- `status`: `backlog` | `planned` | `readyForDev` | `inDev` | `codeReview` | `inTest` | `done`

### `PUT /api/cards/{id}` — com Bearer, mesmo formato do POST (DTO completo)

### `PATCH /api/cards/{id}` — com Bearer, só campos a alterar

```json
{
  "status": "done",
  "pontos": 8
}
```

### `POST /api/cards/{id}/move` — com Bearer

```json
{
  "status": "inTest",
  "posicao": 1
}
```

- `posicao`: pode ser `null`.

### `DELETE /api/cards/{id}` — com Bearer, sem body

### `GET /api/cards/{id}` — com Bearer, sem body (se existir no back)

---

## Checklist

Base: `/api/cards/{cardId}/checklist-itens`

### `POST /api/cards/{cardId}/checklist-itens` — com Bearer

```json
{
  "texto": "Item",
  "concluido": false
}
```

### `PUT /api/cards/{cardId}/checklist-itens/{itemId}` — com Bearer

```json
{
  "texto": "Item atualizado",
  "concluido": true
}
```

### `GET` / `DELETE` nos mesmos paths — com Bearer, sem body (conforme exposto no back)

---

## Comentários

Base: `/api/cards/{cardId}/comentarios`

### `POST /api/cards/{cardId}/comentarios` — com Bearer

```json
{
  "autorId": "uuid-usuario",
  "texto": "Comentário"
}
```

### `PUT /api/cards/{cardId}/comentarios/{comentarioId}` — com Bearer

```json
{
  "texto": "Texto editado"
}
```

### `GET` / `DELETE` — com Bearer, sem body (conforme exposto no back)

---

## Sprints (entidade `/api/sprints`)

### `POST /api/sprints` — com Bearer

```json
{
  "nome": "Sprint 1",
  "dataInicio": "2026-05-01",
  "dataFim": "2026-05-14",
  "status": "planned"
}
```

- `status`: `planned` | `active` | `completed` | `cancelled`
- Datas: `YYYY-MM-DD`

### `PUT /api/sprints/{id}` — com Bearer, mesmo body que o POST

### `GET /api/sprints` / `GET /api/sprints/{id}` — com Bearer, sem body

### `DELETE /api/sprints/{id}` — com Bearer, sem body

### `POST /api/sprints/{sprintId}/cards/{cardId}` — com Bearer, sem body

### `DELETE /api/sprints/{sprintId}/cards/{cardId}` — com Bearer, sem body

### `GET /api/sprints/{sprintId}/cards` — com Bearer, sem body (se existir no back)

---

## Usuários

### `POST /api/usuarios` — com Bearer

```json
{
  "nome": "Nome",
  "email": "mail@exemplo.com",
  "senha": "mínimo8",
  "perfil": "membro"
}
```

### `PUT /api/usuarios/{id}` — com Bearer

```json
{
  "nome": "Nome",
  "email": "mail@exemplo.com",
  "senha": "opcional mínimo8",
  "perfil": "admin"
}
```

### `GET /api/usuarios` / `GET /api/usuarios/{id}` — com Bearer, sem body

### `DELETE /api/usuarios/{id}` — com Bearer, sem body

---

## Exemplo `fetch` (Vite, proxy `/api`)

**POST card:**

```ts
await fetch('/api/cards', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    titulo: 'Tarefa',
    descricao: '',
    pontos: 3,
    tempoEstimado: null,
    status: 'backlog',
    responsavelId: null,
    workspaceId: workspaceId,
    posicao: 0,
    assignee: null,
  }),
})
```

**Completar sprint (sem body, sem Content-Type JSON):**

```ts
await fetch(`/api/workspaces/${workspaceId}/sprints/complete`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
})
```

---

## Módulos no código (`src/api/`)

| Área | Ficheiro |
|------|----------|
| Cliente HTTP | `client.ts`, `config.ts` |
| Auth | `auth.ts` |
| Billing | `billing.ts` |
| Workspaces + board + search + sprints | `workspaces.ts` |
| Cards | `cards.ts` |
| Checklist | `checklistItens.ts` |
| Comentários | `comentarios.ts` |
| Sprints entidade | `sprintsResource.ts` |
| Usuários | `usuarios.ts` |
| Mapeamento respostas → UI | `mappers.ts` |
