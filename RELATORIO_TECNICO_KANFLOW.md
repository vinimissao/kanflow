# Relatório Técnico - Projeto Kanflow

## Capa

**Empresa (equipe):** FlowLabs Tecnologia  
**Projeto/Solução:** Kanflow - Plataforma Web de Gestão Ágil de Tarefas  
**Integrantes:** [Inserir nome completo de todos os integrantes]  
**Ano:** 2026  

> Observação: inserir logomarca da empresa (FlowLabs Tecnologia) e logomarca do projeto (Kanflow) na versão final diagramada.

---

## Sumário

1. Resumo Executivo  
2. Sobre o Projeto  
   2.1. Contexto  
   2.2. Necessidades identificadas  
   2.3. Solução  
   2.4. Protótipos  
   2.5. Especificações técnicas sobre a implementação do sistema  
   2.5.1. Requisitos funcionais e não funcionais  
   2.5.2. Arquitetura da solução  
   2.5.3. Banco de dados  
   2.6. Dados e informações gerenciais  
3. Considerações finais  
4. Referências  
5. Apêndice A - Termo de uso  
6. Apêndice B - Política de privacidade  

> Observação: atualizar o número das páginas na versão final após a diagramação.

---

## Resumo Executivo

O projeto **Kanflow** consiste em uma solução web para apoio ao gerenciamento ágil de tarefas com base em quadro Kanban, com funcionalidades de cadastro/login, movimentação de cards por fluxo de trabalho, gestão de detalhes de cada card e visualizações gerenciais para acompanhamento de sprint e desempenho da equipe.

A solução foi concebida para organizar o ciclo de desenvolvimento de software, aumentar a transparência entre membros da equipe e fornecer indicadores práticos para suporte à tomada de decisão. O sistema oferece uma experiência visual simples e responsiva, com foco em usabilidade, atualização rápida de status e acompanhamento de evolução do trabalho.

No aspecto técnico, o projeto utiliza uma arquitetura front-end SPA (Single Page Application), desenvolvida em **React + TypeScript**, com build via **Vite** e estilização com **Tailwind CSS**. O estado da aplicação é gerenciado no cliente, com persistência local para sessão de usuário e dados de trabalho manipulados em memória.

---

## 1. Sobre o Projeto

O **Kanflow** é um sistema orientado ao acompanhamento de atividades de times de desenvolvimento, inspirado no fluxo de trabalho utilizado em ferramentas de gestão ágil. Seu objetivo principal é permitir que equipes visualizem, priorizem e acompanhem tarefas ao longo de etapas como backlog, planejamento, desenvolvimento, revisão, testes e conclusão.

A abordagem de desenvolvimento adotada foi incremental, com entregas por funcionalidade (autenticação local, quadro Kanban, detalhamento de cards e painéis de gestão). O período de desenvolvimento pode ser registrado conforme o cronograma da equipe.

**Integrantes e responsabilidades (preencher):**
- Integrante 1 - Product Owner / documentação e requisitos
- Integrante 2 - UX/UI e prototipação
- Integrante 3 - Desenvolvimento front-end
- Integrante 4 - Testes e validação
- Integrante 5 - Apoio em arquitetura e governança técnica

---

## 1.1 Contexto

No contexto de desenvolvimento de software, equipes frequentemente enfrentam dificuldades para manter visão clara do andamento das tarefas, distribuição de responsabilidades, estimativas e progresso real das entregas. Em cenários acadêmicos e organizacionais, esse problema impacta prazos, comunicação e qualidade dos resultados.

Modelos ágeis de trabalho, como Kanban, são amplamente utilizados para mitigar esse cenário ao tornar o fluxo visível e contínuo. Entretanto, parte das equipes ainda utiliza controles dispersos (planilhas, anotações e mensagens), o que reduz rastreabilidade e dificulta análise gerencial.

Nesse contexto, o Kanflow foi proposto para centralizar o controle de tarefas em uma interface única, com rastreamento por etapa e recursos de acompanhamento.

**Requisitos de negócio destacados:**
- Controle visual do ciclo de vida das tarefas.
- Registro de responsável, dificuldade e tempo estimado.
- Acompanhamento de progresso por sprint e por colaborador.

**Requisitos legais essenciais representados no software:**
- Transparência no tratamento de dados do usuário (nome/e-mail inseridos em cadastro/login).
- Necessidade de termo de uso e política de privacidade.
- Boas práticas de segurança e minimização de dados.

---

## 1.2 Necessidades identificadas

As principais necessidades identificadas no público-alvo (estudantes, squads acadêmicas e equipes de desenvolvimento) foram:

- Falta de visualização única do andamento das atividades.
- Dificuldade para atualizar status e manter fluxo de trabalho consistente.
- Ausência de visão de desempenho da sprint e evolução das entregas.
- Falta de referência para estimativas colaborativas (ex.: sprint poker).
- Necessidade de controlar checklist e comentários por tarefa.

**Perfis impactados:**
- Desenvolvedores(as): necessitam priorizar tarefas e atualizar status rapidamente.
- Líder de equipe / gestor(a): necessita visão consolidada para decisões de planejamento.
- Time de qualidade/testes: necessita acompanhar cards em revisão e validação.

---

## 1.3 Solução

A solução proposta chama-se **Kanflow**. Trata-se de um sistema web de gestão de tarefas orientado a fluxo Kanban, com foco em simplicidade operacional e apoio à tomada de decisão no contexto de desenvolvimento ágil.

**Visão geral da solução:**
- O usuário realiza acesso por telas de login/cadastro.
- O sistema apresenta o quadro Kanban com colunas de status.
- Cards podem ser movimentados entre colunas por drag and drop.
- Cada card pode ter responsável, dificuldade, tempo estimado, checklist e comentários.
- O ambiente inclui painéis de gestão para desempenho, evolução de sprints, sprint poker e ranking de colaboradores.

**Necessidades atendidas:**
- Organização do fluxo de trabalho.
- Rastreabilidade de evolução das tarefas.
- Apoio a planejamento e priorização.
- Visibilidade de indicadores gerenciais.

**Segurança, legalidade e acessibilidade contempladas:**
- Validação de campos obrigatórios em formulários.
- Possibilidade de logout e controle de sessão local.
- Recomenda-se evoluir para consentimento explícito de uso de dados, política de retenção, criptografia de credenciais e ajustes de acessibilidade WCAG (contraste, navegação por teclado e leitores de tela).

---

## 1.4 Protótipos

O fluxo principal de usuário (user flow) é:
1. Acessar tela de login.
2. Realizar login ou ir para cadastro.
3. Entrar no ambiente principal (home).
4. Visualizar quadro Kanban e gerenciar cards.
5. Acessar menu de gestão para indicadores e apoio à decisão.

**Protótipos de interface sugeridos para anexar (uma página por tela):**
- Protótipo 1 - Tela de Login: autenticação inicial e validação de campos.
- Protótipo 2 - Tela de Cadastro: registro de novo usuário.
- Protótipo 3 - Tela Home com Quadro Kanban: colunas e cards com drag and drop.
- Protótipo 4 - Modal de Card: edição de detalhes, checklist e comentários.
- Protótipo 5 - Painel de Performance da Sprint.
- Protótipo 6 - Painel de Evolução das Sprints.
- Protótipo 7 - Sprint Poker.
- Protótipo 8 - Lista de Sprints e Desenvolvimento de Colaboradores.

> Recomenda-se anexar prints reais do sistema para compor esta seção.

---

## 1.5 Especificações técnicas sobre a implementação do sistema

Esta seção apresenta a base técnica utilizada no desenvolvimento do Kanflow, incluindo stack, ferramentas, requisitos de infraestrutura e organização das funcionalidades implementadas.

**Softwares e tecnologias utilizadas:**
- **Vite**: servidor de desenvolvimento e empacotamento da aplicação front-end.
- **React 18**: construção da interface baseada em componentes.
- **TypeScript 5**: tipagem estática para maior confiabilidade e manutenção.
- **Tailwind CSS 3**: estilização utilitária e responsiva.
- **@dnd-kit/core**: implementação de drag and drop dos cards.
- **PostCSS + Autoprefixer**: processamento de estilos para compatibilidade.
- **Git/GitHub (recomendado no processo da equipe)**: versionamento e colaboração.

**Infraestrutura mínima (uso da aplicação):**
- Navegador moderno (Chrome, Edge ou Firefox atualizado).
- Sistema operacional com suporte a navegador atual.
- Conectividade de rede para eventual hospedagem web.

**Infraestrutura mínima (desenvolvimento):**
- Node.js LTS e npm.
- Editor de código (Cursor/VS Code).
- Ambiente local com suporte a execução de `npm install` e `npm run dev`.

---

## 1.5.1 Requisitos funcionais e não funcionais

### Requisitos funcionais (RF)

- **RF01** - Permitir acesso por tela de login com validação de campos obrigatórios.
- **RF02** - Permitir cadastro de usuário com nome, e-mail e senha.
- **RF03** - Exibir quadro Kanban com colunas de fluxo (Backlog a Concluído).
- **RF04** - Permitir criação de novos cards com título, descrição, responsável, dificuldade e tempo.
- **RF05** - Permitir movimentação de cards entre colunas via drag and drop.
- **RF06** - Permitir edição de detalhes do card (responsável, dificuldade e tempo).
- **RF07** - Permitir adicionar e marcar itens de checklist.
- **RF08** - Permitir registrar comentários nos cards com data/hora.
- **RF09** - Exibir indicadores de performance da sprint.
- **RF10** - Exibir evolução por sprint, lista de sprints e ranking de colaboradores.
- **RF11** - Disponibilizar funcionalidade de sprint poker com média de pontuações.
- **RF12** - Permitir logout e retorno à tela de login.

### Requisitos não funcionais (RNF)

- **RNF01 - Usabilidade:** interface intuitiva, responsiva e com baixa curva de aprendizado.
- **RNF02 - Desempenho:** resposta rápida para operações comuns (movimentar cards, editar card, trocar painel).
- **RNF03 - Manutenibilidade:** código modular com tipagem estática e separação por componentes.
- **RNF04 - Portabilidade:** execução em navegadores atuais sem dependência de instalação local para uso final.
- **RNF05 - Confiabilidade:** validações básicas para evitar entradas vazias e inconsistências simples.

### Requisitos legais, segurança e acessibilidade

- **Legais (LGPD e transparência):**
  - Coleta mínima de dados (nome/e-mail para identificação de usuário).
  - Necessidade de consentimento e documentação por Termo de Uso e Política de Privacidade.
- **Segurança da informação:**
  - Validação de dados de entrada no front-end.
  - Recomendação de evolução para autenticação segura no back-end, hash de senha e controle de sessão robusto.
- **Acessibilidade digital:**
  - Estrutura semântica de formulários e botões.
  - Recomendação de evolução para conformidade ampliada com WCAG (contraste, labels completos, navegação por teclado e ARIA).

---

## 1.5.2 Arquitetura da solução

Arquitetura proposta para o Kanflow (visão atual do projeto):

- **Camada de apresentação (Front-end SPA):** React + TypeScript + Tailwind.
- **Camada de interação:** componentes de UI, hooks de estado e eventos de drag and drop.
- **Camada de domínio local:** estrutura de cards, colunas e regras de fluxo no cliente.
- **Persistência local:** uso de LocalStorage para sessão de usuário.

Como evolução arquitetural, recomenda-se:
- Inclusão de API REST (Node.js/Express ou similar).
- Banco de dados persistente para usuários, cards, comentários e histórico.
- Camada de autenticação com JWT/sessão e criptografia de credenciais.

**Descrição da figura (inserir diagrama):**
1. Usuário interage com navegador.
2. Front-end processa regras de UI e fluxo Kanban.
3. Dados de sessão são armazenados localmente.
4. (Evolução) Front-end consome API e persiste dados em banco.

---

## 1.5.3 Banco de dados

**Situação atual:** a versão atual do Kanflow opera majoritariamente com dados em memória no front-end e persistência local de sessão no navegador (LocalStorage), sem banco relacional/NoSQL em produção.

Para atendimento pleno dos requisitos de persistência e CRUD em ambiente real, propõe-se a adoção de banco de dados relacional, por exemplo **PostgreSQL 16**.

### Modelo sugerido (MER simplificado)

Entidades principais:
- **Usuario** (id, nome, email, senha_hash, perfil, criado_em)
- **Card** (id, titulo, descricao, dificuldade, tempo_estimado, status, responsavel_id, criado_em, atualizado_em)
- **ChecklistItem** (id, card_id, texto, concluido, criado_em)
- **Comentario** (id, card_id, autor_id, texto, criado_em)
- **Sprint** (id, nome, data_inicio, data_fim, status)
- **CardSprint** (id, card_id, sprint_id)

Relacionamentos:
- Usuário 1:N Card (responsável)
- Card 1:N ChecklistItem
- Card 1:N Comentario
- Card N:N Sprint (via CardSprint)

### CRUD

O sistema foi concebido para suportar operações de **Create, Read, Update e Delete** sobre cards, checklists, comentários e usuários (na evolução com back-end e banco persistente).

### Dicionário de dados (resumo)

- `Usuario.id`: UUID, chave primária.
- `Usuario.email`: varchar(255), único.
- `Card.status`: enum (`backlog`, `planned`, `readyForDev`, `inDev`, `codeReview`, `inTest`, `done`).
- `Card.dificuldade`: enum (`Baixa`, `Média`, `Alta`).
- `ChecklistItem.concluido`: boolean.
- `Comentario.texto`: text.

---

## 1.6 Dados e informações gerenciais

O Kanflow apresenta informações úteis para decisão estratégica e tática da equipe, incluindo:

- Quantidade total de cards, cards concluídos e cards em andamento.
- Percentual de progresso geral da entrega.
- Percentual de checklist concluído.
- Evolução por sprint (cards concluídos por sprint).
- Estimativa agregada de horas por sprint.
- Ranking de colaboradores com base em entregas e avanço de checklist.

Esses dados apoiam decisões de priorização, replanejamento de sprint, balanceamento de carga e identificação de gargalos no fluxo de trabalho.

---

## 2. Considerações finais

O projeto Kanflow atende ao propósito de organizar e acompanhar atividades de desenvolvimento por meio de uma solução web intuitiva, com recursos de operação diária (quadro Kanban e cards) e apoio gerencial (indicadores e visão por sprint).

Como principais resultados, destacam-se a melhoria da visibilidade do processo, maior clareza sobre responsabilidades e apoio à tomada de decisão com base em dados de progresso.

Como limitações da versão atual, observam-se ausência de back-end persistente, autenticação robusta e controles avançados de governança de dados. Como evolução recomendada, propõe-se implementar API, banco relacional, perfilamento de usuários, trilha de auditoria, integração de notificações e adequação ampliada à LGPD e acessibilidade.

---

## Referências

- [React - Documentação Oficial](https://react.dev/)
- [TypeScript - Documentação Oficial](https://www.typescriptlang.org/)
- [Vite - Documentação Oficial](https://vitejs.dev/)
- [Tailwind CSS - Documentação Oficial](https://tailwindcss.com/)
- [dnd kit - Documentação Oficial](https://dndkit.com/)
- [Lei Geral de Proteção de Dados Pessoais (LGPD) - Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [WCAG Overview (W3C)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## Apêndice A - Termo de uso

**Termo de Uso - Sistema Kanflow**

Ao utilizar o Kanflow, o usuário declara estar ciente de que:

1. O sistema destina-se à organização de tarefas e acompanhamento de fluxo de trabalho.
2. O usuário é responsável pelas informações registradas em sua conta e pelos dados inseridos nos cards.
3. É proibido inserir conteúdo ilícito, ofensivo ou que viole direitos de terceiros.
4. O sistema pode registrar dados operacionais necessários para funcionamento e melhoria contínua.
5. A equipe mantenedora pode realizar atualizações e manutenções para evolução da plataforma.
6. Em caso de uso indevido, o acesso poderá ser suspenso.

**Termo específico por perfil (sugestão):**
- Usuário colaborador: foco em execução e atualização de tarefas.
- Usuário gestor: foco em administração de fluxo e análise de indicadores.

---

## Apêndice B - Política de privacidade

**Política de Privacidade - Sistema Kanflow**

Esta política descreve como os dados dos usuários são tratados no Kanflow.

1. **Dados coletados:** nome, e-mail e dados inseridos no uso da plataforma (cards, comentários, checklists).
2. **Finalidade:** autenticação, identificação do usuário, operação do sistema e geração de indicadores de uso.
3. **Base legal e transparência:** tratamento orientado por necessidade operacional e consentimento informado.
4. **Compartilhamento:** não há compartilhamento com terceiros sem base legal, salvo exigência normativa.
5. **Retenção:** os dados são mantidos pelo período necessário ao funcionamento e objetivos da plataforma.
6. **Direitos do titular:** acesso, correção, atualização e solicitação de exclusão conforme legislação aplicável.
7. **Segurança:** adoção de práticas técnicas e administrativas para proteção contra acesso não autorizado.

**Canal de contato para privacidade (preencher):** [e-mail da equipe/empresa]

