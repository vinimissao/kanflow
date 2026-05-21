# Kanflow

Plataforma web de **gestão ágil de tarefas** com quadro **Kanban**: cadastro/login, workspaces, colunas, cards com drag-and-drop, checklists, comentários, sprints, indicadores e recursos como sprint poker. O foco é dar visibilidade ao fluxo de trabalho e apoiar decisões de planejamento.

Este repositório contém o **front-end** da solução. A persistência em banco e a API REST ficam no **back-end** (esperado: **Spring Boot** em Java), que deve ser executado separadamente.

---

## Linguagens e tecnologias (neste repositório)

| Camada | Tecnologia |
|--------|------------|
| Linguagem | **TypeScript** (strict) |
| UI | **React 18** |
| Build / dev server | **Vite 5** |
| Estilos | **Tailwind CSS 3** + PostCSS |
| Drag and drop | **@dnd-kit/core** |
| Alvo JS | **ES2022** (`tsconfig.json`) |

**Scripts npm:** `dev`, `build`, `preview`, `typecheck` (veja a seção [Como rodar](#como-rodar-o-projeto)).

---

## Arquitetura em alto nível

```
Navegador (React SPA :5173 em dev)
    → pedidos HTTP para /api/...
    → em desenvolvimento: proxy do Vite encaminha para o Spring (:8080 por padrão)
    → Spring persiste em banco (ex.: PostgreSQL), conforme configuração do back-end
```

- **Desenvolvimento recomendado:** front em `http://localhost:5173`, API em outra porta (ex. `8080`). O Vite faz **proxy** de `/api` para o Spring, evitando CORS entre origens diferentes.
- **Alternativa:** definir `VITE_API_URL` e chamar a API diretamente (o back-end precisa liberar CORS para a origem do front).
- **Modo demo:** `VITE_DEMO_LOCAL=true` desliga chamadas à API (quadro local para testes de UI).

Documentação dos endpoints consumidos pelo front: [`docs/API.md`](docs/API.md).

---

## Banco de dados

**Importante:** não há servidor de banco nem migrations **neste repositório**. O front-end só consome JSON pela API.

Na documentação técnica do projeto ([`RELATORIO_TECNICO_KANFLOW.md`](RELATORIO_TECNICO_KANFLOW.md)) a equipe propõe **PostgreSQL 16** (ou outro SGBDR relacional) como persistência para usuários, cards, checklists, comentários, sprints, etc., com modelo entidade-relacionamento resumido no relatório.

**Como “rodar o banco” na prática:**

1. Suba o **PostgreSQL** (Docker, serviço local ou nuvem) conforme a equipe definiu no **repositório do back-end Spring**.
2. Configure a **URL JDBC**, usuário e senha no `application.properties` / `application.yml` do Spring (variáveis de ambiente ou arquivo local — siga o README do back-end).
3. Execute as **migrations** ou scripts SQL que o back-end fornecer (Flyway/Liquibase ou SQL manual).
4. Inicie o **Spring Boot** na porta que o front espera (padrão deste projeto: **8080**, ou ajuste `VITE_PROXY_TARGET`).

Sem o back-end e o banco configurados, o front sozinho não grava dados no servidor; use `VITE_DEMO_LOCAL=true` apenas para navegar sem API.

---

## Pré-requisitos

- **Node.js** 18 ou superior (recomendado LTS atual) e **npm** (ou pnpm/yarn, se preferir adaptar os comandos).
- **Back-end Spring** (repositório separado) acessível na URL/porta configurada no `.env`.
- Opcional para uso completo: **PostgreSQL** (ou o banco que o Spring estiver usando), gerenciado pelo time no projeto da API.

---

## Como rodar o projeto

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositório>
cd kanflow
npm install
```

### 2. Variáveis de ambiente

Copie o exemplo e ajuste se necessário:

```bash
copy .env.example .env
```

No Windows PowerShell pode usar `Copy-Item .env.example .env`.

Principais variáveis (ver comentários em [`.env.example`](.env.example)):

| Variável | Uso |
|----------|-----|
| `VITE_PROXY_TARGET` | URL do Spring para o proxy em dev (padrão no código: `http://127.0.0.1:8080`). |
| `VITE_API_URL` | Opcional: base absoluta da API (ex. `http://127.0.0.1:8080`); exige CORS no back-end. |
| `VITE_DEMO_LOCAL` | `true` ou `1`: modo demo sem API. |

**Recomendação em dev:** não defina `VITE_API_URL`; deixe só `VITE_PROXY_TARGET` alinhado à porta do Spring.

### 3. Subir o back-end e o banco

Siga o README do projeto **Spring** da equipe (subir PostgreSQL, aplicar schema, `mvn spring-boot:run` ou equivalente, porta **8080** ou a que você configurar).

### 4. Servidor de desenvolvimento (front)

```bash
npm run dev
```

Abra **http://localhost:5173** (porta fixa `5173` em [`vite.config.ts`](vite.config.ts)).

### 5. Build de produção

```bash
npm run build
```

Saída em `dist/`. Para testar o build localmente:

```bash
npm run preview
```

**Produção:** em build estático, `getApiRoot()` usa `VITE_API_URL` quando definida no momento do `npm run build`. Sem `VITE_API_URL`, a raiz da API pode ficar vazia em produção — configure a URL da API no ambiente de build (CI/CD ou `.env.production`) conforme o deploy.

### 6. Verificação de tipos

```bash
npm run typecheck
```

---

## Estrutura útil do repositório

| Caminho | Descrição |
|---------|-----------|
| `src/` | Código fonte React/TS |
| `src/api/` | Cliente HTTP, autenticação, mapeamentos DTO |
| `src/components/` | Componentes de UI |
| `docs/API.md` | Contrato REST usado pelo front |
| `vite.config.ts` | Proxy `/api` → Spring |
| `RELATORIO_TECNICO_KANFLOW.md` | Contexto de negócio, requisitos e modelo de dados sugerido |

---

## Documentação adicional

- **API (métodos, bodies, headers):** [`docs/API.md`](docs/API.md)
- **Visão de produto, requisitos e MER sugerido:** [`RELATORIO_TECNICO_KANFLOW.md`](RELATORIO_TECNICO_KANFLOW.md)

---

## Equipe (referência no relatório técnico)

FlowLabs Tecnologia — Kanflow (integrantes listados na capa do relatório técnico).

---

## Licença

Projeto privado (`"private": true` em `package.json`). Ajuste esta seção se o repositório tiver licença pública.
