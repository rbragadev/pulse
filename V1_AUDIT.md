# Pulse V1 — Auditoria Técnica e Funcional

> Última atualização: 2026-05-07  
> Revisor: Claude Sonnet 4.6  
> Status: **V1 estabilizada e pronta para teste interno**

---

## Resumo Executivo

| Área | Status | Observação |
|---|---|---|
| Autenticação (Google OAuth + JWT) | ✅ Funcional | Produção-ready |
| Feed + Kudos Core | ✅ Funcional | Paginação acumulativa corrigida |
| Reações e Comentários (Kudos) | ✅ Funcional | `_count.comments` corrigido |
| PointRule (cooldown/limite semanal) | ✅ Funcional | Enforced no `KudosService.create()` |
| Achievements (conquistas) | ✅ Funcional | Chamado automaticamente após cada kudos |
| Ranking (Galácticos + Geral) | ✅ Funcional | Pontos ponderados via SQL |
| Perfil Social | ✅ Funcional | ProfileVisit com throttle 24h |
| Hall da Fama + Temporadas | ✅ Funcional | Seed cria 2 temporadas de exemplo |
| Badges | ✅ Funcional | Catálogo real + award/revoke admin |
| Admin Backoffice | ✅ Funcional | Dashboard, Users, Categories, Kudos, Rules, Communities |
| Comunidades | ✅ Funcional | V1 completo: posts, comentários, reações, membros, admin |
| Notificações | 🔔 Preview | Dados hardcoded — badge "Preview" visível |
| Aniversariantes | 🔔 Preview | Dados hardcoded — badge "Preview" visível |
| Eventos | 🔔 Preview | Dados hardcoded — badge "Preview" visível |

---

## 1. Funcionalidades Prontas (V1 — Produção-ready)

### 1.1 Autenticação
- Google OAuth2 via `passport-google-oauth20` com restrição de domínio `@grupootg.com`
- JWT gerado no callback, salvo no Zustand (`auth.store`)
- `JwtAuthGuard` protege todas as rotas autenticadas
- `RolesGuard` + `@Roles(Role.ADMIN)` protege o backoffice
- `findOrCreateUser` cria conta na primeira entrada e atualiza avatar em logins subsequentes

### 1.2 Kudos Core
- **Criar kudos** — validação: sem auto-kudos, usuário/destinatário/categoria ativos
- **PointRule enforced** — `weeklyLimit` e `cooldownHours` verificados antes de criar
- **Feed** — `GET /kudos/feed` retorna posts com `likedByMe` e `_count.comments` corrigido
- **Feed paginado** — posts acumulam ao clicar "Carregar mais" (sem substituição)
- **Like / Unlike** — idempotente
- **Achievements automáticos** — `checkAndGrantAchievements()` chamado (non-blocking) para author e recipient após cada kudos criado

### 1.3 Reações e Comentários
- Picker de reações (🔥🚀❤️👏🧠) com toggle e contagem em tempo real
- Seção de comentários expansível: lista + input com Enter/botão
- Backend: `POST/GET /kudos/:id/react`, `GET/POST/DELETE /kudos/:id/comments`
- Contagem de comentários correta no feed (`_count.comments`)

### 1.4 Ranking
- `GET /ranking/galacticos` — top 10 do mês corrente, `SUM(category.weight)`
- `GET /ranking/all-time` — top 10 histórico, mesmo cálculo ponderado
- GalacticosPage com pódio olímpico animado e lista completa

### 1.5 Admin Backoffice
- **Dashboard** — contagem real: users, kudos do mês, top 5 categorias, top 5 usuários
- **Usuários** — toggle `isActive` / `role`, paginação
- **Categorias** — full CRUD inline
- **Moderação de Kudos** — filtro por status, ações: ocultar / remover / restaurar
- **Regras de pontuação** — edição de `points`, `weeklyLimit`, `cooldownHours`
- **Analytics** — métricas gerais
- **Comunidades** — status (ACTIVE/INACTIVE/ARCHIVED) + toggle oficial
- Rota `/admin/posts` redireciona para `/admin/kudos` (rota legada removida)

### 1.6 Perfil Social
- Header com banner, avatar, stats (kudos recebidos/enviados/badges)
- Reputação: votos TRUSTWORTHY/COOL/PROFESSIONAL com barra + toggle vote
- Badges por raridade, conquistas recentes
- Kudos recebidos/enviados em abas
- Visitantes recentes com **throttle 24h** (sem auto-visita, máx 1 por visitorId/dia)
- Fãs + Top categorias
- Seção de comunidades no próprio perfil

### 1.7 Hall da Fama + Temporadas
- `GET /seasons/hall-of-fame` — top 3 de temporadas passadas + all-time
- Seed: 2 temporadas (Abril encerrada + Maio ativa) com rankings reais

### 1.8 Badges
- Catálogo público por raridade (COMMON → LEGENDARY)
- Admin: award/revoke por userId+badgeId
- Seed: 8 badges criados, distribuídos entre usuários principais

### 1.9 Comunidades (V1)
- **5 modelos:** `Community`, `CommunityMember`, `CommunityPost`, `CommunityPostComment`, `CommunityPostReaction`
- **Roles:** OWNER / MODERATOR / MEMBER
- **Proteções:** sole-OWNER não pode sair, não-membro não pode postar
- **Seed:** 12 comunidades, 25 posts, 28 comentários, 37 reações
- **CommunitiesPage:** discovery com hero stats, tabs, busca, filtro por categoria
- **CommunityDetailPage:** layout 2-colunas Orkut — sidebar (owner/mods/membros) + feed de posts
- **CreateCommunityDialog:** slug auto-gerado a partir do nome
- **CommunitiesWidget:** dados reais (comunidades do usuário ou top-5 gerais)
- **Admin `/admin/communities`:** status inline + toggle oficial

---

## 2. Funcionalidades Preview (mockadas — claramente sinalizadas na UI)

### 2.1 Notificações
**Localização:** [frontend/src/components/shared/NotificationsDropdown.tsx](frontend/src/components/shared/NotificationsDropdown.tsx)

7 notificações hardcoded. Badge "em breve" visível no rodapé do dropdown. Nenhum modelo de backend.

### 2.2 Aniversariantes da Semana
**Localização:** [frontend/src/components/widgets/BirthdaysWidget.tsx](frontend/src/components/widgets/BirthdaysWidget.tsx)

4 aniversários fictícios. Widget exibe badge "Preview" e nota explicativa. `User` sem campo `birthday`.

### 2.3 Próximos Eventos
**Localização:** [frontend/src/components/widgets/EventsWidget.tsx](frontend/src/components/widgets/EventsWidget.tsx)

4 eventos fictícios com datas fixas. Widget exibe badge "Preview" e nota explicativa. Sem modelo `Event` no banco.

---

## 3. Inconsistências conhecidas (não críticas para V1)

### 3.1 Hall da Fama — Ranking all-time usa contagem simples
**Localização:** [backend/src/seasons/seasons.service.ts](backend/src/seasons/seasons.service.ts)

`getHallOfFame()` usa `_count.id` (contagem de posts) enquanto `RankingService` usa `SUM(weight)` (pontos ponderados). Os dois "all-time" mostram valores diferentes para o mesmo período. Não crítico para V1.

### 3.2 Perfil de outros usuários não mostra comunidades
A seção de comunidades no ProfilePage só aparece no próprio perfil. Não existe endpoint público de `GET /communities/user/:id`. Pós-V1.

---

## 4. Riscos Técnicos para Produção

| Risco | Severidade | Status |
|---|---|---|
| Sem rate limiting na API | Alta | Pendente — `@nestjs/throttler` não configurado |
| ProfileVisit flood | Média | ✅ Corrigido — throttle 24h implementado |
| PointRule não enforced | Média | ✅ Corrigido — weeklyLimit + cooldownHours ativos |
| Achievements não disparados | Média | ✅ Corrigido — `checkAndGrantAchievements` chamado |
| Feed substitui posts | Baixa | ✅ Corrigido — acumulação com useState |
| `_count.comments` zerado | Baixa | ✅ Corrigido — adicionado ao `postInclude` |
| AdminPosts rota quebrada | Baixa | ✅ Corrigido — redireciona para /admin/kudos |
| `$queryRaw` sem prepared statements | Baixa | OK — tagged template Prisma já é seguro |
| JWT secret em variável de ambiente | OK | Padrão correto |

---

## 5. TODOs Pós-V1

### Alta Prioridade
- [ ] Adicionar `@nestjs/throttler` como rate limiter global
- [ ] Unificar cálculo all-time no Hall da Fama com query ponderada (item 3.1)
- [ ] Adicionar `@MinLength(5)` e `@MaxLength(500)` no `message` do `CreateKudosDto`

### Média Prioridade
- [ ] Comunidades: perfil de outros usuários mostrar suas comunidades
- [ ] Comunidades: upload de avatar/banner próprio
- [ ] Comunidades: posts privados / comunidades PRIVATE (join por convite)
- [ ] Automatizar `snapshotActiveSeason()` via cron mensal

### Baixa Prioridade / Futuro
- [ ] Implementar Notificações reais (tabela `Notification` + SSE)
- [ ] Campo `birthday` no `User` + widget de Aniversariantes real
- [ ] Modelo `Event` + widget de Eventos real
- [ ] Automatizar concessão de Badges baseada em achievements
- [ ] Analytics de tendência temporal (gráfico por semana/mês)
- [ ] Perfil: edição de avatar e bio pelo usuário

---

## 6. Fluxo completo funcional para teste interno

1. Login com conta `@grupootg.com` via Google
2. Ver feed de reconhecimentos com likes, reações e comentários em tempo real
3. Criar um kudos (respeitará `weeklyLimit` e `cooldownHours` da categoria)
4. Conquistas são verificadas automaticamente após o kudos
5. Ver perfil de outros usuários (badges, conquistas, reputação, votação)
6. Ver o ranking Galácticos (mensal e geral)
7. Ver o Hall da Fama (temporadas passadas + histórico)
8. Ver o catálogo de Badges
9. Explorar comunidades, entrar/sair, criar tópicos, reagir, comentar
10. **Admin:** dashboard, usuários, kudos, categorias, regras, analytics, comunidades
