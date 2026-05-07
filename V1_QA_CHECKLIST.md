# Pulse V1 — QA Checklist Manual

> Versão: V1  
> Data: 2026-05-07  
> Usar antes do teste interno com a equipe OTG.

Legenda: ✅ Passou | ❌ Falhou | ⏭ Pulado

---

## 1. Auth

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| A-01 | Acessar `/feed` sem estar logado | Redireciona para `/login` | |
| A-02 | Clicar "Continuar com Google" | Redireciona para OAuth Google | |
| A-03 | Login com email `@grupootg.com` válido | Autenticado, redireciona para `/feed` | |
| A-04 | Login com email de outro domínio | Erro de acesso negado | |
| A-05 | Recarregar página autenticado | Sessão mantida (token no localStorage) | |
| A-06 | Clicar em logout (sidebar) | Token removido, redireciona para `/login` | |
| A-07 | Token expirado | Redireciona para `/login` automaticamente | |

---

## 2. Feed

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| F-01 | Acessar `/feed` autenticado | Lista de kudos em ordem cronológica decrescente | |
| F-02 | Feed vazio | Mensagem de estado vazio + botão "Reconhecer alguém" | |
| F-03 | Clicar "Carregar mais" | Posts anteriores permanecem; novos são adicionados abaixo | |
| F-04 | Total de posts exibido no header | Número correto de reconhecimentos | |
| F-05 | Skeleton loading ao abrir página | 4 skeletons exibidos durante carregamento | |
| F-06 | Skeletons ao carregar mais | 3 skeletons exibidos ao paginar | |
| F-07 | Novo kudos criado | Feed reinicia do topo com o novo post visível | |

---

## 3. Kudos

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| K-01 | Abrir dialog de criar kudos | Lista de usuários ativos, categorias ativas | |
| K-02 | Selecionar si mesmo como destinatário | Erro: "Você não pode enviar kudos para si mesmo" | |
| K-03 | Criar kudos válido | Post aparece no topo do feed, toast de sucesso | |
| K-04 | Categoria com weeklyLimit=2: enviar 3 kudos nessa categoria na semana | 3º kudos bloqueado com mensagem de limite | |
| K-05 | Categoria com cooldownHours=24: reenviar para mesmo colega/categoria em < 24h | Bloqueado com mensagem de cooldown | |
| K-06 | Categoria com cooldownHours=24: reenviar após > 24h | Permitido | |
| K-07 | Usuário com conta inativa tenta criar kudos | Erro: "Sua conta está inativa" | |
| K-08 | Destinatário inativo | Erro: "Colaborador não está ativo" | |

---

## 4. Likes

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| L-01 | Curtir um post | Contador incrementa, ícone ativo | |
| L-02 | Descurtir um post já curtido | Contador decrementa, ícone inativo | |
| L-03 | Curtir o próprio post | Deve funcionar (sem restrição de negócio) | |
| L-04 | Curtir duas vezes (duplo clique rápido) | Idempotente — sem duplicidade | |

---

## 5. Reações (Kudos)

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| R-01 | Reagir com 🔥 em um post | Ícone ativo, contagem não exibida (só o emoji ativo) | |
| R-02 | Reagir com 🔥 novamente (toggle) | Reação removida | |
| R-03 | Reagir com tipos diferentes no mesmo post | Cada tipo exibe seu estado independente | |
| R-04 | Reações persistem após recarregar | Sim | |

---

## 6. Comentários (Kudos)

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| C-01 | Clicar ícone de comentários | Seção expande, lista de comentários | |
| C-02 | Contagem de comentários no feed | Número correto exibido antes de expandir | |
| C-03 | Escrever e enviar comentário (botão) | Comentário aparece na lista | |
| C-04 | Enviar comentário com Enter | Comentário enviado | |
| C-05 | Deletar próprio comentário | Comentário removido da lista | |
| C-06 | Admin deletar qualquer comentário | Permitido | |
| C-07 | Usuário deletar comentário alheio | Erro 403 | |

---

## 7. Perfil Social

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| P-01 | Acessar `/profile` | Próprio perfil com badges, conquistas, kudos | |
| P-02 | Acessar `/profile/:id` de outro usuário | Perfil do usuário, sem botão "Você" | |
| P-03 | Votar em reputação de outro usuário | Voto registrado, barra atualizada | |
| P-04 | Votar em si mesmo | Erro 403 | |
| P-05 | Votar novamente no mesmo tipo | Toggle — voto removido | |
| P-06 | Visitante recente aparece após visita | Sim (máx 1 por visitante por 24h) | |
| P-07 | Visitar próprio perfil | Não registra visita | |
| P-08 | Visitar mesmo perfil 2x em < 24h | Só 1 registro criado | |
| P-09 | Aba "Recebidos" | Kudos recebidos pelo usuário | |
| P-10 | Aba "Enviados" | Kudos enviados pelo usuário | |
| P-11 | Seção Comunidades (próprio perfil) | Lista de comunidades que participa | |

---

## 8. Achievements

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| ACH-01 | Criar primeiro kudos | Achievement KUDOS_SENT progride | |
| ACH-02 | Receber primeiro kudos | Achievement KUDOS_RECEIVED progride | |
| ACH-03 | Atingir conditionValue de um achievement | `completed = true`, data registrada | |
| ACH-04 | Enviar kudos duplicado (re-run) | Sem achievement duplicado (upsert) | |

---

## 9. Ranking

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| RK-01 | Acessar `/galacticos` | Top 10 do mês com pódio | |
| RK-02 | Criação de kudos ponderada por `weight` | Usuário sobe no ranking conforme peso da categoria | |
| RK-03 | Ranking all-time | Lista histórica separada do mensal | |

---

## 10. Hall da Fama

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| HF-01 | Acessar `/hall-of-fame` | Temporadas passadas + top 3 de cada | |
| HF-02 | Temporada ativa exibida no SeasonWidget | Nome, datas, top 3 da temporada | |
| HF-03 | Seed criou temporada Abril encerrada | Aparece no Hall | |

---

## 11. Badges

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| B-01 | Acessar `/badges` | Catálogo completo por raridade | |
| B-02 | Badge LEGENDARY tem visual destacado | Borda dourada + glow | |
| B-03 | Admin award badge a usuário | Badge aparece no perfil do usuário | |
| B-04 | Admin revoke badge | Badge removida do perfil | |

---

## 12. Comunidades

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| COM-01 | Acessar `/communities` | Grid de comunidades com stats no hero | |
| COM-02 | Filtrar por categoria | Apenas comunidades da categoria exibidas | |
| COM-03 | Buscar por nome | Resultado filtrado em tempo real | |
| COM-04 | Aba "Minhas comunidades" | Comunidades que o usuário é membro | |
| COM-05 | Aba "Criadas por mim" | Comunidades criadas pelo usuário | |
| COM-06 | Entrar em comunidade | Botão muda para "✓ Participando", contador incrementa | |
| COM-07 | Sair de comunidade | Botão volta para "+ Participar" | |
| COM-08 | Owner único tenta sair | Erro: "sole owner" não pode sair | |
| COM-09 | Criar comunidade | Dialog abre, slug gerado automaticamente | |
| COM-10 | Criar comunidade com slug duplicado | Erro de conflito | |
| COM-11 | Acessar página de detalhe (`/communities/:slug`) | Layout 2 colunas com sidebar + feed | |
| COM-12 | Sidebar: owner, moderadores, membros recentes | Exibidos corretamente | |
| COM-13 | Membro cria tópico | Post aparece no feed da comunidade | |
| COM-14 | Não-membro tenta criar tópico | Botão de criação não aparece | |
| COM-15 | Não-membro acessa detalhe | Vê posts mas não pode criar | |
| COM-16 | Reagir em post de comunidade | Reação salva, toggle funciona | |
| COM-17 | Comentar em post de comunidade | Comentário aparece na thread | |
| COM-18 | Comunidades aparecem no widget do feed | Widget mostra comunidades do usuário | |
| COM-19 | Seeds: 12 comunidades criadas | Visíveis em `/communities` | |

---

## 13. Admin

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| ADM-01 | Usuário comum acessa `/admin` | Redireciona para `/feed` | |
| ADM-02 | Admin acessa `/admin` | Dashboard com métricas reais | |
| ADM-03 | Admin lista usuários | Tabela com toggle isActive e role | |
| ADM-04 | Admin desativa usuário | Usuário desativado não consegue criar kudos | |
| ADM-05 | Admin acessa `/admin/kudos` | Lista de todos os posts com moderação | |
| ADM-06 | Admin oculta post | Status muda para HIDDEN, sai do feed | |
| ADM-07 | Admin remove post | Status muda para REMOVED | |
| ADM-08 | Admin restaura post | Status volta para ACTIVE | |
| ADM-09 | Admin acessa `/admin/categories` | CRUD de categorias | |
| ADM-10 | Admin edita weeklyLimit de categoria | Novo limite refletido nos kudos criados | |
| ADM-11 | Admin acessa `/admin/rules` | Edição de PointRules por categoria | |
| ADM-12 | Admin acessa `/admin/communities` | Tabela de comunidades com status | |
| ADM-13 | Admin muda status de comunidade para ARCHIVED | Status atualizado | |
| ADM-14 | Admin marca comunidade como oficial | Badge "Oficial" aparece na comunidade | |
| ADM-15 | URL `/admin/posts` (legado) | Redireciona para `/admin/kudos` | |

---

## 14. Seeds

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| SD-01 | `make seed` sem erros | Seed completa sem exceção | |
| SD-02 | Re-executar seed | Idempotente — sem erros de duplicidade | |
| SD-03 | Usuários criados | `raphaelbraga@grupootg.com` (ADMIN) + demais usuários | |
| SD-04 | Departamentos criados | Mínimo 4 departamentos visíveis | |
| SD-05 | Kudos criados | Posts aparecem no feed | |
| SD-06 | Badges distribuídos | Usuários têm badges no perfil | |
| SD-07 | Temporadas criadas | Abril encerrada + Maio ativa | |
| SD-08 | Comunidades criadas | 12 comunidades visíveis em `/communities` | |
| SD-09 | Posts de comunidade criados | 25 posts nas comunidades | |

---

## 15. Responsividade

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| RSP-01 | Feed em mobile (< 768px) | Sidebar de widgets oculta, feed ocupa tela toda | |
| RSP-02 | CommunitiesPage em mobile | Grid de 1 coluna | |
| RSP-03 | CommunityDetailPage em mobile | Layout coluna única (sidebar vira topo) | |
| RSP-04 | Admin em mobile | Tabelas com scroll horizontal | |

---

## 16. Segurança

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| SEC-01 | Requisição sem token JWT | 401 Unauthorized | |
| SEC-02 | Token inválido/adulterado | 401 Unauthorized | |
| SEC-03 | Usuário comum chama `POST /admin/...` | 403 Forbidden | |
| SEC-04 | Usuário tenta deletar comentário alheio | 403 Forbidden | |
| SEC-05 | Sole-owner tenta sair de comunidade | 400 Bad Request com mensagem clara | |
| SEC-06 | Não-membro tenta criar post em comunidade | 403 Forbidden | |

---

## Resumo de execução

| Área | Total | Passou | Falhou | Pulado |
|------|-------|--------|--------|--------|
| Auth | 7 | | | |
| Feed | 7 | | | |
| Kudos | 8 | | | |
| Likes | 4 | | | |
| Reações | 4 | | | |
| Comentários | 7 | | | |
| Perfil | 11 | | | |
| Achievements | 4 | | | |
| Ranking | 3 | | | |
| Hall da Fama | 3 | | | |
| Badges | 4 | | | |
| Comunidades | 19 | | | |
| Admin | 15 | | | |
| Seeds | 9 | | | |
| Responsividade | 4 | | | |
| Segurança | 6 | | | |
| **Total** | **119** | | | |
