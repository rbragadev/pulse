# Pulse V1 — Auditoria Técnica e Funcional

> Data: 2026-05-07  
> Revisor: Claude Sonnet 4.6  
> Objetivo: mapear o estado real da plataforma antes do teste interno com a equipe OTG.

---

## Resumo Executivo

| Área | Status | Observação |
|---|---|---|
| Autenticação (Google OAuth + JWT) | ✅ Funcional | Produção-ready |
| Feed + Kudos Core | ✅ Funcional | Like otimista, `likedByMe`, paginação com bug menor |
| Ranking (Galácticos + Geral) | ✅ Funcional | Pontos ponderados via SQL |
| Admin Backoffice | ✅ Funcional | Dashboard, Users, Categories, Kudos, Rules |
| Perfil Social | ✅ Funcional | Badges, conquistas, votos, visitantes, fãs |
| Reações e Comentários | ✅ Funcional | Backend OK — UI no KudosCard |
| Hall da Fama + Temporadas | ✅ Funcional | Seed cria 2 temporadas de exemplo |
| Badges | ✅ Funcional | Catálogo real + award/revoke admin |
| PointRule (cooldown/limite semanal) | ⚠️ Parcial | Dados salvos mas **não aplicados** no fluxo |
| Achievements (conquistas) | ⚠️ Parcial | Lógica pronta mas **não chamada** automaticamente |
| Feed "Carregar mais" | ⚠️ Parcial | Substitui posts em vez de acumular |
| AdminPosts page | ❌ Quebrado | Endpoint de delete inexistente no backend |
| Notificações | 🎭 Mock | Dados hardcoded, nenhuma API |
| Aniversariantes | 🎭 Mock | Nomes fixos, sem campo `birthday` no User |
| Eventos | 🎭 Mock | Array constante, sem modelo no banco |
| Comunidades | ✅ Funcional | V1 completo: posts, comentários, reações, membros, admin |

---

## 1. Funcionalidades Prontas (Produção-ready)

### 1.1 Autenticação
- Google OAuth2 via `passport-google-oauth20` com restrição de domínio `@grupootg.com`
- JWT gerado no callback, salvo no Zustand (`auth.store`)
- `JwtAuthGuard` protege todas as rotas autenticadas
- `RolesGuard` + `@Roles(Role.ADMIN)` protege o backoffice
- `findOrCreateUser` cria conta na primeira entrada e atualiza avatar em logins subsequentes

### 1.2 Kudos Core
- **Criar kudos** — validação: sem auto-kudos, usuário/destinatário/categoria ativos
- **Feed** — `GET /kudos/feed` retorna posts com `likedByMe` calculado por usuário, filtra só `ACTIVE`
- **Like / Unlike** — `POST /DELETE /kudos/:id/like` idempotente (não lança erro se já curtido/descurtido)
- **Feed no frontend** — `FeedComposer`, `KudosCard` com like otimista (estado local + invalidação de cache)
- **Criar kudos via dialog** — seleção de destinatário (usuários ativos), categoria, mensagem; feedback via toast

### 1.3 Ranking
- `GET /ranking/galacticos` — top 10 do mês corrente, pontos = `SUM(category.weight)`
- `GET /ranking/all-time` — top 10 histórico, mesmo cálculo ponderado
- SQL raw com `$queryRaw` corretamente tipado para BigInt → Number
- GalacticosPage com pódio olímpico animado e lista completa

### 1.4 Admin Backoffice
- **Dashboard** — contagem real: totalUsers, activeUsers, totalKudos, kudosThisMonth, top 5 categorias, top 5 usuários do mês
- **Usuários** — lista paginada, toggle `isActive` (UserX/UserCheck), toggle `role` (Shield/ShieldOff), toast de feedback
- **Categorias** — full CRUD inline: criar, editar nome/ícone/cor/peso/ativo
- **Moderação de Kudos** — filtro por status (ACTIVE/HIDDEN/REMOVED), ações: ocultar, remover, restaurar
- **Regras de pontuação** — edição de `points`, `weeklyLimit`, `cooldownHours` por categoria

### 1.5 Perfil Social
- Header com banner colorido pelo departamento, avatar, stats (kudos recebidos/enviados/badges)
- Seção de reputação: votos TRUSTWORTHY/COOL/PROFESSIONAL com barra de progresso, toggle vote
- Badges do usuário por raridade com tooltip de data de desbloqueio
- Conquistas recentes com progresso
- Kudos recebidos/enviados em abas com `KudosCard`
- Visitantes recentes (últimas 8 visitas distintas), Fãs (quem mais enviou kudos), Top categorias
- Visita registrada automaticamente ao acessar perfil alheio (`GET /social-profile/:userId`)

### 1.6 Reações e Comentários (KudosCard)
- Picker de reações (🔥🚀❤️👏🧠) com toggle e contagem em tempo real
- Seção de comentários expansível: lista + input com Enter/botão de envio
- Backend: `POST/GET /kudos/:id/react`, `GET/POST/DELETE /kudos/:id/comments`

### 1.7 Hall da Fama + Temporadas
- `GET /seasons` → lista todas temporadas com rankings
- `GET /seasons/active` → temporada ativa (usada pelo SeasonWidget no feed)
- `GET /seasons/hall-of-fame` → top 3 de temporadas passadas + all-time
- Seed cria 2 temporadas (Abril 2026 encerrada + Maio 2026 ativa) com rankings reais

### 1.8 Badges
- Catálogo público: `GET /badges` exibe todos por raridade (COMMON → LEGENDARY)
- Admin: award/revoke por userId+badgeId
- Seed: 8 badges criados, distribuídos entre usuários principais

### 1.9 Comunidades (V1)
- **5 modelos no banco:** `Community`, `CommunityMember`, `CommunityPost`, `CommunityPostComment`, `CommunityPostReaction`
- **Backend:** CRUD completo com roles OWNER/MODERATOR/MEMBER, join/leave (impede sole-owner de sair), posts, comentários, reações toggle (upsert)
- **Seed:** 12 comunidades com banners (Unsplash), avatares (DiceBear), 25 posts, 28 comentários, 37 reações
- **CommunitiesPage:** discovery com hero stats, tabs (Todas / Minhas / Criadas), busca, filtro por categoria, grid de cards
- **CommunityDetailPage:** layout 2-colunas estilo Orkut — sidebar com owner/mods/membros recentes + feed de posts com reações e comentários inline
- **CreateCommunityDialog:** formulário com slug auto-gerado a partir do nome, seleção de categoria
- **CommunitiesWidget:** dados reais — mostra comunidades do usuário (ou top-5 gerais como fallback)
- **ProfilePage:** seção "Comunidades" na sidebar para o próprio perfil
- **Admin `/admin/communities`:** tabela com status (ACTIVE/INACTIVE/ARCHIVED) editável via select inline e toggle de oficial

---

## 2. Funcionalidades Parciais (Atenção necessária)

### 2.1 PointRule — Cooldown e limite semanal **NÃO aplicados**
**Localização:** [backend/src/kudos/kudos.service.ts](backend/src/kudos/kudos.service.ts#L58)

As regras existem no banco e são editáveis pelo admin, mas o método `create()` nunca as consulta. Atualmente um usuário pode enviar kudos ilimitados, sem respeitar `weeklyLimit` nem `cooldownHours`.

**Fix necessário:** antes de criar o kudos, buscar a `PointRule` da categoria e validar:
1. Contagem de kudos enviados pelo autor nessa categoria na semana atual
2. Último kudos enviado pelo autor para o mesmo destinatário na mesma categoria (cooldown)

### 2.2 Achievements — Concessão automática não conectada
**Localização:** [backend/src/achievements/achievements.service.ts](backend/src/achievements/achievements.service.ts#L20)

`checkAndGrantAchievements(userId)` está implementado e correto — verifica 4 métricas (`KUDOS_RECEIVED`, `KUDOS_SENT`, `UNIQUE_SENDERS`, `UNIQUE_DEPARTMENTS`) e faz upsert com progresso. Mas **nunca é chamado** após um kudos ser criado.

**Fix necessário:** chamar `achievementsService.checkAndGrantAchievements(dto.recipientId)` e `checkAndGrantAchievements(authorId)` ao final de `KudosService.create()`.

### 2.3 Feed — Paginação substitui em vez de acumular
**Localização:** [frontend/src/pages/FeedPage.tsx](frontend/src/pages/FeedPage.tsx#L22)

O `queryKey` inclui `page`, então ao clicar "Carregar mais" a query muda e os posts anteriores somem — em vez de acumular. O botão funciona mas a UX está incorreta.

**Fix necessário:** usar `useInfiniteQuery` ou acumular posts manualmente via `useState<KudosPost[]>`.

### 2.4 `_count.comments` ausente no feed
**Localização:** [backend/src/kudos/kudos.repository.ts](backend/src/kudos/kudos.repository.ts#L5)

`postInclude` só inclui `_count: { select: { likes: true } }`. O campo `_count.comments` esperado pelo tipo `KudosPost` retorna `undefined` no feed.

**Fix:** adicionar `comments: true` ao `_count.select` em `postInclude`.

### 2.5 Hall da Fama — Inconsistência no ranking all-time
**Localização:** [backend/src/seasons/seasons.service.ts](backend/src/seasons/seasons.service.ts#L46)

`getHallOfFame()` usa `groupBy._count.id` (contagem simples) para o ranking geral histórico, enquanto `ranking.service.ts` usa `SUM(weight)` (pontos ponderados). Os dois "all-time" mostram valores diferentes para o mesmo período.

**Fix:** `getHallOfFame()` deve usar a mesma query SQL ponderada de `getAllTimeRanking()`.

---

## 3. Funcionalidades Mockadas (Não implementadas)

### 3.1 Notificações
**Localização:** [frontend/src/components/shared/NotificationsDropdown.tsx](frontend/src/components/shared/NotificationsDropdown.tsx)

Dropdown com 7 notificações hardcoded. O badge de "não lido" e o markAllRead funcionam apenas em memória local (sem persistência). Nenhum endpoint de backend existe. Aviso "em breve" visível no rodapé do dropdown.

### 3.2 Aniversariantes da Semana
**Localização:** [frontend/src/components/widgets/BirthdaysWidget.tsx](frontend/src/components/widgets/BirthdaysWidget.tsx)

Array `BIRTHDAYS` com 4 nomes fictícios, datas hardcoded. O modelo `User` não tem campo `birthday`. Widget puramente decorativo.

### 3.3 Próximos Eventos
**Localização:** [frontend/src/components/widgets/EventsWidget.tsx](frontend/src/components/widgets/EventsWidget.tsx)

Array `EVENTS` com 4 eventos fictícios. Nenhum modelo `Event` no schema. Datas fixas (15 Mai, 20 Mai...) que nunca atualizam.

---

## 4. Bugs Encontrados

### BUG-01 — AdminPosts: endpoint DELETE inexistente
**Severidade:** Alta  
**Localização:** [frontend/src/pages/admin/AdminPosts.tsx](frontend/src/pages/admin/AdminPosts.tsx#L22)

```ts
mutationFn: (id: string) => api.delete(`/admin/posts/${id}`)
```

O endpoint `DELETE /admin/posts/:id` não existe no backend. A página AdminPosts também lê de `/kudos` (feed público) em vez de `/admin/kudos`, então só vê posts ACTIVE e não tem controle de moderação.

**Fix:** Remover a página AdminPosts do router (já existe `AdminKudos` que faz moderação corretamente) ou reescrever para usar `/admin/kudos`.

### BUG-02 — ProfileVisit: flood de registros sem throttle
**Severidade:** Média  
**Localização:** [backend/src/social-profile/social-profile.service.ts](backend/src/social-profile/social-profile.service.ts#L128)

Cada GET em `/social-profile/:userId` cria um `ProfileVisit` sem nenhum throttle. Um usuário que atualizar a página 50 vezes gera 50 registros. A tabela pode crescer indefinidamente.

**Fix:** Verificar se já existe uma visita do mesmo `visitorId` nas últimas N horas antes de criar.

### BUG-03 — `_count.comments` nunca preenchido no feed
**Severidade:** Baixa  
**Localização:** [backend/src/kudos/kudos.repository.ts](backend/src/kudos/kudos.repository.ts#L9)

`postInclude` não inclui `comments` no `_count`. O `KudosCard` mostra o botão de comentários mas não exibe contagem inicial (fica em branco até abrir a seção).

### BUG-04 — Feed "Carregar mais" substitui posts
**Severidade:** Baixa  
**Localização:** [frontend/src/pages/FeedPage.tsx](frontend/src/pages/FeedPage.tsx)

Ao clicar "Carregar mais", o `queryKey` muda para `['kudos', 2]` e os posts da página 1 somem. O usuário perde o que já havia lido.

### BUG-05 — Sem validação de comprimento na mensagem de kudos
**Severidade:** Baixa  
**Localização:** [backend/src/kudos/dto/create-kudos.dto.ts](backend/src/kudos/dto/create-kudos.dto.ts)

O campo `message` não tem `@MinLength` nem `@MaxLength`. Um usuário pode enviar uma mensagem vazia (string de 1 espaço) ou um texto de vários megabytes.

---

## 5. Riscos Técnicos para Produção

| Risco | Severidade | Mitigação sugerida |
|---|---|---|
| Sem rate limiting na API | Alta | Adicionar `@nestjs/throttler` global |
| ProfileVisit sem throttle (BUG-02) | Média | Dedup por visitorId + intervalo mínimo |
| PointRule não enforced | Média | Ver item 2.1 |
| Sem paginação real no feed | Média | `useInfiniteQuery` + cursor pagination |
| `$queryRaw` sem prepared statements | Baixa | Valores passados via tagged template (já seguro no Prisma) |
| JWT secret em variável de ambiente | OK | Padrão correto — não commitar `.env` |
| Dados de seed (senha/PII) em repo público | Baixa | Seed usa emails fictícios exceto `raphaelbraga@grupootg.com` |

---

## 6. TODOs Pós-V1 (Prioridade sugerida)

### Alta Prioridade
- [ ] **[BUG-01]** Remover `AdminPosts` do router ou reescrever — a rota `/admin/posts` está quebrada
- [ ] **[2.1]** Aplicar `PointRule` em `KudosService.create()`: checar `weeklyLimit` e `cooldownHours`
- [ ] **[2.2]** Chamar `checkAndGrantAchievements()` no `KudosService.create()` após criar o post
- [ ] **[BUG-02]** Throttle em `recordVisit()`: no máximo 1 registro por visitante por hora/dia
- [ ] Adicionar `@nestjs/throttler` como rate limiter global na API

### Média Prioridade
- [ ] **[BUG-04]** Corrigir paginação do feed com `useInfiniteQuery` (acumular posts)
- [ ] **[BUG-03]** Adicionar `comments: true` ao `_count.select` em `postInclude`
- [ ] **[2.5]** Unificar cálculo all-time no Hall da Fama com a query ponderada do `RankingService`
- [ ] **[BUG-05]** Adicionar `@MinLength(5)` e `@MaxLength(500)` no campo `message` do `CreateKudosDto`
- [ ] Automatizar `snapshotActiveSeason()` via cron mensal (hoje só via `POST /seasons/snapshot`)

### Baixa Prioridade / Futuro
- [ ] Implementar sistema de Notificações reais (tabela `Notification` + SSE ou WebSocket)
- [ ] Implementar campo `birthday` no `User` + widget de Aniversariantes real
- [ ] Implementar `Event` model + widget de Eventos real
- [ ] Comunidades: posts privados / comunidades PRIVATE (join por convite)
- [ ] Comunidades: upload de avatar/banner próprio
- [ ] Adicionar admin UI para gerenciar Badges (tela dedicada com award/revoke por usuário)
- [ ] Automatizar concessão de Badges baseada em achievements (trigger após `checkAndGrantAchievements`)
- [ ] Adicionar analytics de tendência temporal (gráfico de kudos por semana/mês)
- [ ] Perfil: edição de avatar e bio pelo usuário

---

## 7. O que funciona end-to-end agora (sem alterações)

Para o teste interno, o seguinte fluxo está 100% funcional:

1. Login com conta `@grupootg.com` via Google
2. Ver feed de reconhecimentos com likes em tempo real
3. Criar um kudos para um colega (categoria, mensagem)
4. Ver perfil de outros usuários (badges, conquistas, reputação, votação)
5. Ver o ranking Galácticos (mensal e geral)
6. Ver o Hall da Fama (temporadas passadas + histórico)
7. Ver o catálogo de Badges
8. **Admin (`raphaelbraga@grupootg.com`):** dashboard, gerenciar usuários, moderar kudos, editar categorias e regras
9. Explorar comunidades, entrar/sair, criar tópicos, reagir, comentar
