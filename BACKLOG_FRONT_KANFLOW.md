# Kanflow — Onde estamos e o que vem depois

Este arquivo resume, em linguagem simples, **o que o aplicativo já faz**, **o que normalmente está sendo desenvolvido agora** e **o que ainda falta**.  
*(No quadro do próprio Kanflow também existem cards com essas mesmas ideias.)*

---

## Em uma frase

Hoje o Kanflow é um **protótipo completo na tela**: dá para usar o quadro, arrastar cards e ver painéis — mas os dados ficam **no navegador**, como um rascunho. O próximo passo natural é **guardar tudo em um servidor** e **login de verdade**.

---

## 1. O que já funciona (para o usuário)

- **Entrar no app** — Telas de login e cadastro; o sistema lembra só o **nome** que você digitou (ainda não é conta real com senha no servidor).
- **Quadro Kanban** — Várias colunas (do backlog até concluído), cards com título, descrição, responsável e prioridade.
- **Arrastar entre colunas** — Você pode mover um card de uma coluna para outra arrastando.
- **Abrir o card** — Ver e editar responsável, dificuldade, tempo estimado; checklist de subtarefas; lista de comentários.
- **Sprint no modo demo** — Botões para “finalizar sprint” e “novo quadro”: funcionam localmente e alimentam os painéis de histórico (ainda sem salvar na nuvem).
- **Painéis laterais** — Telas com números e visão de sprints passadas, usando só os dados que estão na sessão atual.

**Em resumo:** a experiência visual e o fluxo principal do Kanban já existem; falta **persistência séria** e **segurança de conta**.

---

## 2. O que costuma estar em andamento agora

*(É o que o time costuma atacar quando vai integrar com o backend.)*

- **Ligar o app ao servidor** — Em vez de guardar cards só na memória do navegador, buscar e salvar pelo backend (criar, editar, mover card, finalizar sprint, etc.).
- **“Projeto” ou espaço de trabalho** — Definir um espaço (workspace) para cada time e garantir que todo card pertença a esse espaço, como o sistema no servidor vai exigir.

---

## 3. O que ainda falta (próximas melhorias)

- **Busca** — O campo de busca no topo ainda não filtra os cards de verdade (nem conversa com o servidor).
- **Ordem dos cards na mesma coluna** — Hoje dá para mudar de coluna; **mudar a ordem dentro da coluna** (quem vem primeiro, segundo…) ainda não está redondo no produto.
- **Login real** — Conta com e-mail/senha (ou similar), sessão segura e regras de quem pode administrar o time — importante para os planos pagos.
- **Links diretos** — Por exemplo abrir já na aba certa ou em um endereço fixo; hoje a navegação é mais “interna” ao app.
- **Termo de uso e planos na tela** — O texto já existe em arquivo; falta mostrar no app, pedir aceite e respeitar limites do plano (Free, Básico, Full).
- **Acessibilidade** — Deixar o app mais fácil para quem usa teclado só, leitor de tela ou precisa de mais contraste — é uma melhoria contínua.

---

## 4. Ordem das colunas no quadro (do início ao fim)

Para você se situar no fluxo visual:

**Backlog → Planejado → Pronto para Dev → Em Dev → Revisão → Em Teste → Concluído**

---

## Detalhes técnicos

Quem for programar encontra os mesmos temas nos cards do arquivo de dados inicial do projeto e pode cruzar com o código da pasta `src`.
