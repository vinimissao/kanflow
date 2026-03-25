# RELATORIO TECNICO - KANFLOW (MODELO ABNT)

> Modelo em conformidade com a estrutura da ABNT (principalmente NBR 14724) adaptado ao roteiro da disciplina.  
> Antes da entrega final, aplique a formatacao no editor (Word/Docs): fonte 12 (Times New Roman ou Arial), espaco 1,5, margens 3 cm (superior/esquerda) e 2 cm (inferior/direita), alinhamento justificado, numeracao de paginas no canto superior direito a partir da introducao textual.

---

## CAPA

**[NOME DA INSTITUICAO]**  
**[CURSO]**  
**[DISCIPLINA / PROJETO INTEGRADOR]**

**FLOWLABS TECNOLOGIA**  
**KANFLOW - PLATAFORMA WEB DE GESTAO AGIL DE TAREFAS**

**[NOME COMPLETO INTEGRANTE 1]**  
**[NOME COMPLETO INTEGRANTE 2]**  
**[NOME COMPLETO INTEGRANTE 3]**  
**[NOME COMPLETO INTEGRANTE 4]**  
**[NOME COMPLETO INTEGRANTE 5]**

**[CIDADE]**  
**2026**

> Inserir na capa a logomarca da empresa (equipe) e a logomarca do projeto, conforme orientacao da atividade.

---

## FOLHA DE ROSTO

**FLOWLABS TECNOLOGIA**  
**KANFLOW - PLATAFORMA WEB DE GESTAO AGIL DE TAREFAS**

Relatorio Tecnico apresentado ao **[NOME DA INSTITUICAO]**, no curso de **[NOME DO CURSO]**, como requisito parcial de avaliacao da disciplina **[NOME DA DISCIPLINA]**.

Orientador(a): **[NOME DO/A PROFESSOR/A]**

**[CIDADE]**  
**2026**

---

## RESUMO EXECUTIVO

O projeto **Kanflow** consiste em uma solucao web para apoio ao gerenciamento agil de tarefas com base em quadro Kanban, com funcionalidades de cadastro/login, movimentacao de cards por fluxo de trabalho, gestao de detalhes de cada card e visualizacoes gerenciais para acompanhamento de sprint e desempenho da equipe.

A solucao foi concebida para organizar o ciclo de desenvolvimento de software, aumentar a transparencia entre membros da equipe e fornecer indicadores praticos para suporte a tomada de decisao. O sistema oferece experiencia visual simples e responsiva, com foco em usabilidade, atualizacao rapida de status e acompanhamento da evolucao do trabalho.

No aspecto tecnico, o projeto utiliza arquitetura front-end SPA (Single Page Application), desenvolvida em **React + TypeScript**, com build via **Vite** e estilizacao com **Tailwind CSS**. O estado da aplicacao e gerenciado no cliente, com persistencia local para sessao de usuario e dados de trabalho manipulados em memoria.

> Conforme sua orientacao, este item e um Resumo Executivo (nao resumo academico), sem palavras-chave e sem Abstract.

---

## SUMARIO

1. Sobre o Projeto  
1.1 Contexto  
1.2 Necessidades identificadas  
1.3 Solucao  
1.4 Prototipos  
1.5 Especificacoes tecnicas sobre a implementacao do sistema  
1.5.1 Requisitos funcionais e nao funcionais  
1.5.2 Arquitetura da solucao  
1.5.3 Banco de dados  
1.6 Dados e informacoes gerenciais  
2. Consideracoes finais  
Referencias  
Apendice A - Termo de uso  
Apendice B - Politica de privacidade  

> Atualize os numeros de pagina automaticamente no editor de texto ao final da diagramacao.

---

## 1 SOBRE O PROJETO

O **Kanflow** e um sistema orientado ao acompanhamento de atividades de times de desenvolvimento, inspirado no fluxo de trabalho utilizado em ferramentas de gestao agil. Seu objetivo principal e permitir que equipes visualizem, priorizem e acompanhem tarefas ao longo de etapas como backlog, planejamento, desenvolvimento, revisao, testes e conclusao.

A abordagem de desenvolvimento adotada foi incremental, com entregas por funcionalidade (autenticacao local, quadro Kanban, detalhamento de cards e paineis de gestao). O periodo de desenvolvimento deve ser registrado conforme o cronograma real da equipe.

### Integrantes e responsabilidades

- Integrante 1 - Product Owner e documentacao de requisitos.
- Integrante 2 - UX/UI e prototipacao.
- Integrante 3 - Desenvolvimento front-end.
- Integrante 4 - Testes e validacao.
- Integrante 5 - Apoio em arquitetura e qualidade.

---

## 1.1 CONTEXTO

No contexto de desenvolvimento de software, equipes frequentemente enfrentam dificuldades para manter visao clara do andamento das tarefas, distribuicao de responsabilidades, estimativas e progresso real das entregas. Em cenarios academicos e organizacionais, esse problema impacta prazos, comunicacao e qualidade dos resultados.

Modelos ageis de trabalho, como Kanban, sao amplamente utilizados para mitigar esse cenario ao tornar o fluxo visivel e continuo. Entretanto, parte das equipes ainda utiliza controles dispersos (planilhas, anotacoes e mensagens), o que reduz rastreabilidade e dificulta analise gerencial.

Nesse contexto, o Kanflow foi proposto para centralizar o controle de tarefas em uma interface unica, com rastreamento por etapa e recursos de acompanhamento.

**Requisitos de negocio destacados:**
- Controle visual do ciclo de vida das tarefas.
- Registro de responsavel, dificuldade e tempo estimado.
- Acompanhamento de progresso por sprint e por colaborador.

**Requisitos legais essenciais representados no software:**
- Transparencia no tratamento de dados do usuario.
- Necessidade de Termo de Uso e Politica de Privacidade.
- Boas praticas de seguranca e minimizacao de dados.

---

## 1.2 NECESSIDADES IDENTIFICADAS

As principais necessidades identificadas no publico-alvo (estudantes, squads academicas e equipes de desenvolvimento) foram:

- Falta de visualizacao unica do andamento das atividades.
- Dificuldade para atualizar status e manter fluxo consistente.
- Ausencia de visao de desempenho da sprint e evolucao das entregas.
- Falta de referencia para estimativas colaborativas (sprint poker).
- Necessidade de controlar checklist e comentarios por tarefa.

**Perfis impactados:**
- Desenvolvedores(as): priorizar tarefas e atualizar status rapidamente.
- Lider de equipe/gestor(a): visao consolidada para decisoes de planejamento.
- Time de qualidade/testes: acompanhamento de cards em revisao e validacao.

---

## 1.3 SOLUCAO

A solucao proposta chama-se **Kanflow**. Trata-se de um sistema web de gestao de tarefas orientado a fluxo Kanban, com foco em simplicidade operacional e apoio a tomada de decisao no contexto de desenvolvimento agil.

**Visao geral da solucao:**
- Usuario realiza acesso por telas de login/cadastro.
- Sistema apresenta quadro Kanban com colunas de status.
- Cards podem ser movimentados entre colunas por drag and drop.
- Cada card pode conter responsavel, dificuldade, tempo estimado, checklist e comentarios.
- O ambiente inclui paineis de gestao para desempenho, evolucao, sprint poker e ranking.

**Requisitos legais e de seguranca contemplados (versao atual e evolucao):**
- Validacao de campos obrigatorios em formularios.
- Logout e controle de sessao local.
- Evolucao recomendada para autenticacao segura no back-end, hash de senha, consentimento explicito e trilha de auditoria.

**Acessibilidade digital (estado atual e melhorias):**
- Estrutura semantica basica de formularios e botoes.
- Melhorias sugeridas: contraste, navegacao por teclado, labels completos e atributos ARIA.

---

## 1.4 PROTOTIPOS

### Fluxo de usuario (user flow)

1. Acessar tela de login.  
2. Realizar login ou ir para cadastro.  
3. Entrar no ambiente principal.  
4. Visualizar quadro Kanban e gerenciar cards.  
5. Acessar menu de gestao para indicadores.

### Prototipos a apresentar (uma pagina por interface)

- Prototipo 1 - Tela de Login.
- Prototipo 2 - Tela de Cadastro.
- Prototipo 3 - Tela Home com Quadro Kanban.
- Prototipo 4 - Modal de Card (detalhes, checklist, comentarios).
- Prototipo 5 - Painel de Performance da Sprint.
- Prototipo 6 - Painel de Evolucao das Sprints.
- Prototipo 7 - Sprint Poker.
- Prototipo 8 - Lista de Sprints e Desenvolvimento de Colaboradores.

> Inserir cada prototipo com legenda e breve descricao analitica.

---

## 1.5 ESPECIFICACOES TECNICAS SOBRE A IMPLEMENTACAO DO SISTEMA

Esta secao apresenta a base tecnica utilizada no desenvolvimento do Kanflow, incluindo stack, ferramentas, requisitos de infraestrutura e organizacao das funcionalidades implementadas.

### Softwares e tecnologias utilizados

- **Vite**: servidor de desenvolvimento e empacotamento.
- **React 18**: construcao de interface baseada em componentes.
- **TypeScript 5**: tipagem estatica e maior confiabilidade.
- **Tailwind CSS 3**: estilizacao utilitaria e responsiva.
- **@dnd-kit/core**: drag and drop dos cards.
- **PostCSS + Autoprefixer**: processamento de estilos.
- **Git/GitHub**: versionamento e colaboracao.

### Requisitos minimos de infraestrutura

**Para uso da aplicacao:**
- Navegador moderno atualizado (Chrome, Edge ou Firefox).
- Sistema operacional com suporte a navegador atual.

**Para desenvolvimento:**
- Node.js LTS e npm.
- Editor de codigo.
- Ambiente capaz de executar `npm install` e `npm run dev`.

---

## 1.5.1 REQUISITOS FUNCIONAIS E NAO FUNCIONAIS

### Requisitos funcionais (RF)

- **RF01** - Permitir login com validacao de campos obrigatorios.
- **RF02** - Permitir cadastro de usuario com nome, e-mail e senha.
- **RF03** - Exibir quadro Kanban com colunas de fluxo.
- **RF04** - Permitir criacao de cards com dados essenciais.
- **RF05** - Permitir movimentacao de cards entre colunas (drag and drop).
- **RF06** - Permitir edicao de detalhes do card.
- **RF07** - Permitir adicionar e marcar checklist.
- **RF08** - Permitir registrar comentarios com data/hora.
- **RF09** - Exibir indicadores de performance da sprint.
- **RF10** - Exibir evolucao por sprint e ranking de colaboradores.
- **RF11** - Disponibilizar sprint poker com media de pontuacao.
- **RF12** - Permitir logout.

### Requisitos nao funcionais (RNF)

- **RNF01 - Usabilidade:** interface intuitiva e responsiva.
- **RNF02 - Desempenho:** resposta rapida para interacoes comuns.
- **RNF03 - Manutenibilidade:** codigo modular e tipado.
- **RNF04 - Portabilidade:** execucao em navegadores atuais.
- **RNF05 - Confiabilidade:** validacoes para evitar entradas invalidas.

### Requisitos legais, seguranca e acessibilidade

- **Legais (LGPD):** coleta minima, transparencia e consentimento.
- **Seguranca:** validacao de entrada e recomendacao de autenticacao segura no back-end.
- **Acessibilidade:** estrutura semantica com evolucao para WCAG.

---

## 1.5.2 ARQUITETURA DA SOLUCAO

### Descricao da arquitetura atual

- Camada de apresentacao: SPA em React/TypeScript.
- Camada de interacao: componentes, hooks e eventos DnD.
- Camada de dominio local: regras de card/coluna no cliente.
- Persistencia local: LocalStorage para sessao.

### Evolucao arquitetural recomendada

- API REST para negocio e autenticacao.
- Banco de dados persistente para usuarios e cards.
- Camada de seguranca com JWT/sessao, hash de senha e controles de auditoria.

> Inserir figura de arquitetura com legenda (ABNT: numerar como Figura 1, Figura 2 etc.) e fonte.

---

## 1.5.3 BANCO DE DADOS

### Situacao atual

A versao atual utiliza dados em memoria no front-end e persistencia local de sessao, sem banco relacional/NoSQL em producao.

### Proposta para versao completa

Adotar banco relacional **PostgreSQL 16**, com operacoes de CRUD para usuarios, cards, checklist, comentarios e sprints.

### Modelo entidade-relacionamento (MER) sugerido

Entidades:
- Usuario (id, nome, email, senha_hash, perfil, criado_em)
- Card (id, titulo, descricao, dificuldade, tempo_estimado, status, responsavel_id, criado_em, atualizado_em)
- ChecklistItem (id, card_id, texto, concluido, criado_em)
- Comentario (id, card_id, autor_id, texto, criado_em)
- Sprint (id, nome, data_inicio, data_fim, status)
- CardSprint (id, card_id, sprint_id)

Relacionamentos:
- Usuario 1:N Card
- Card 1:N ChecklistItem
- Card 1:N Comentario
- Card N:N Sprint (via CardSprint)

### Dicionario de dados (resumo)

- `Usuario.id`: UUID, chave primaria.
- `Usuario.email`: varchar(255), unico.
- `Card.status`: enum (backlog, planned, readyForDev, inDev, codeReview, inTest, done).
- `Card.dificuldade`: enum (Baixa, Media, Alta).
- `ChecklistItem.concluido`: boolean.
- `Comentario.texto`: text.

---

## 1.6 DADOS E INFORMACOES GERENCIAIS

O sistema oferece consultas e indicadores para apoio a tomada de decisao:

- Total de cards, concluidos e em andamento.
- Percentual de progresso geral.
- Percentual de checklist concluido.
- Evolucao por sprint (taxa de conclusao).
- Estimativa agregada de horas por sprint.
- Ranking de colaboradores por entregas e avancos.

Essas informacoes apoiam priorizacao, replanejamento e identificacao de gargalos no fluxo.

---

## 2 CONSIDERACOES FINAIS

O projeto Kanflow atende ao objetivo de organizar e acompanhar atividades de desenvolvimento por meio de solucao web intuitiva, reunindo operacao diaria (quadro e cards) e visao gerencial (indicadores de sprint e equipe).

Como resultados, destacam-se maior visibilidade do processo, clareza de responsabilidades e suporte a tomada de decisao com base em dados. Como limitacoes da versao atual, observam-se ausencia de back-end persistente e autenticacao robusta.

Como evolucoes, recomenda-se implementar API, banco de dados persistente, perfis de usuario, trilha de auditoria, notificacoes e adequacao ampliada a LGPD e acessibilidade.

---

## REFERENCIAS

React. Documentacao oficial. Disponivel em: <https://react.dev/>. Acesso em: 23 mar. 2026.

TypeScript. Documentacao oficial. Disponivel em: <https://www.typescriptlang.org/>. Acesso em: 23 mar. 2026.

Vite. Documentacao oficial. Disponivel em: <https://vitejs.dev/>. Acesso em: 23 mar. 2026.

Tailwind CSS. Documentacao oficial. Disponivel em: <https://tailwindcss.com/>. Acesso em: 23 mar. 2026.

dnd kit. Documentacao oficial. Disponivel em: <https://dndkit.com/>. Acesso em: 23 mar. 2026.

BRASIL. Lei no 13.709, de 14 de agosto de 2018. Lei Geral de Protecao de Dados Pessoais (LGPD). Disponivel em: <https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm>. Acesso em: 23 mar. 2026.

W3C. WCAG Overview. Disponivel em: <https://www.w3.org/WAI/standards-guidelines/wcag/>. Acesso em: 23 mar. 2026.

---

## APENDICE A - TERMO DE USO

Ao utilizar o Kanflow, o usuario declara ciencia de que:

1. O sistema destina-se a organizacao de tarefas e acompanhamento de fluxo de trabalho.
2. O usuario e responsavel pelas informacoes registradas e pelos dados inseridos.
3. E proibido inserir conteudo ilicito, ofensivo ou que viole direitos de terceiros.
4. O sistema pode registrar dados operacionais necessarios ao funcionamento.
5. Atualizacoes e manutencoes podem ocorrer para melhoria da plataforma.
6. Em caso de uso indevido, o acesso podera ser suspenso.

**Perfis de uso (sugestao):**
- Colaborador: execucao e atualizacao de tarefas.
- Gestor: acompanhamento de indicadores e administracao de fluxo.

---

## APENDICE B - POLITICA DE PRIVACIDADE

1. **Dados coletados:** nome, e-mail e dados inseridos no uso da plataforma.
2. **Finalidade:** identificacao de usuario, operacao do sistema e indicadores gerenciais.
3. **Base legal:** necessidade operacional e consentimento informado.
4. **Compartilhamento:** nao ha compartilhamento com terceiros sem base legal.
5. **Retencao:** dados mantidos pelo tempo necessario aos objetivos da plataforma.
6. **Direitos do titular:** acesso, correcao e exclusao conforme legislacao aplicavel.
7. **Seguranca:** adocao de medidas tecnicas e administrativas de protecao.

**Canal de contato de privacidade (preencher):** [e-mail da equipe/empresa]

