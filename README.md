# Pulse — OTG Internal Recognition Platform

Plataforma interna de reconhecimento entre colaboradores da OTG. Feed social de kudos com gamificação, comunidades estilo Orkut, ranking "Galácticos" e painel administrativo completo.

> **Status:** V1 estabilizada — pronta para teste interno

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui |
| Estado | Zustand + TanStack Query v5 |
| Backend | NestJS + Prisma ORM |
| Banco | PostgreSQL 16 |
| Auth | Google OAuth2 + JWT |
| Infra | Docker Compose |

---

## O que está funcional na V1

| Feature | Status |
|---------|--------|
| Auth Google OAuth (domínio @grupootg.com) | ✅ |
| Feed de kudos com likes, reações e comentários | ✅ |
| PointRule — limite semanal e cooldown por categoria | ✅ |
| Achievements automáticos após cada kudos | ✅ |
| Ranking Galácticos (mensal + histórico) | ✅ |
| Hall da Fama + Temporadas | ✅ |
| Perfil social (badges, conquistas, reputação, visitantes) | ✅ |
| Badges por raridade | ✅ |
| Comunidades (posts, comentários, reações, membros) | ✅ |
| Admin backoffice completo | ✅ |
| Notificações | 🔔 Preview |
| Aniversariantes | 🔔 Preview |
| Próximos Eventos | 🔔 Preview |

---

## Setup Rápido

### Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- Credenciais Google OAuth ([console.cloud.google.com](https://console.cloud.google.com))

### 1. Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha no `.env`:

```env
DATABASE_URL=postgresql://pulse:pulse@localhost:5432/pulse
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
JWT_SECRET=uma-chave-secreta-forte-min-32-chars
FRONTEND_URL=http://localhost:5173
```

### 2. Setup completo (primeira vez)

```bash
make setup
```

Instala dependências, sobe o banco, executa migrations e popula com dados de exemplo.

### 3. Iniciar em desenvolvimento

```bash
make dev
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/api/docs |

---

## Comandos

```bash
make install      # Instala dependências (backend + frontend)
make dev          # Inicia ambos em modo desenvolvimento
make backend      # Inicia apenas o backend
make frontend     # Inicia apenas o frontend
make db-up        # Sobe o PostgreSQL via Docker
make db-down      # Para o PostgreSQL
make db-migrate   # Executa migrations do Prisma
make seed         # Popula banco com dados de exemplo
make lint         # Executa linting
make build        # Build de produção
make docker-up    # Sobe todos os serviços via Docker
make docker-down  # Para todos os serviços
```

---

## Estrutura do Projeto

```
pulse/
├── backend/
│   ├── src/
│   │   ├── auth/               # Google OAuth + JWT
│   │   ├── users/              # CRUD de usuários
│   │   ├── kudos/              # Feed, posts, likes, reações, comentários, PointRule
│   │   ├── ranking/            # Galácticos (mensal + histórico)
│   │   ├── departments/        # Departamentos
│   │   ├── badges/             # Catálogo de badges
│   │   ├── achievements/       # Conquistas automáticas
│   │   ├── seasons/            # Temporadas + Hall da Fama
│   │   ├── social-profile/     # Perfil, visitantes, votos
│   │   ├── communities/        # Comunidades, membros, posts
│   │   ├── admin/              # Backoffice
│   │   └── prisma/             # PrismaService
│   └── prisma/
│       ├── schema.prisma       # 20+ models
│       └── seed.ts             # Dados de exemplo completos
├── frontend/
│   └── src/
│       ├── components/         # UI, Layout, Shared, Widgets
│       ├── pages/              # Páginas + Admin
│       ├── store/              # Zustand (auth)
│       ├── hooks/              # useToast
│       ├── lib/                # API client, utils
│       └── types/              # TypeScript types
├── V1_AUDIT.md                 # Auditoria técnica detalhada
├── V1_QA_CHECKLIST.md          # Checklist de QA manual (119 cenários)
├── docker-compose.yml
├── Makefile
└── .env.example
```

---

## Banco de Dados — Models principais

| Model | Descrição |
|-------|-----------|
| `User` | Colaborador com role USER/ADMIN |
| `Department` | Departamento da empresa |
| `KudosPost` | Post de reconhecimento |
| `KudosCategory` | Categoria do reconhecimento |
| `KudosLike` | Like em um post |
| `KudosReaction` | Reação (🔥🚀❤️👏🧠) em um post |
| `KudosComment` | Comentário em um post |
| `PointRule` | Regras de pontuação por categoria (weeklyLimit, cooldownHours) |
| `Badge` | Badge com raridade (COMMON→LEGENDARY) |
| `UserBadge` | Badge desbloqueada por um usuário |
| `Achievement` | Definição de conquista |
| `UserAchievement` | Progresso de conquista por usuário |
| `Season` | Temporada de ranking |
| `SeasonRanking` | Snapshot de ranking por temporada |
| `ProfileVote` | Voto de reputação (TRUSTWORTHY/COOL/PROFESSIONAL) |
| `ProfileVisit` | Visita ao perfil (throttled 24h) |
| `Community` | Comunidade |
| `CommunityMember` | Membro de comunidade (OWNER/MODERATOR/MEMBER) |
| `CommunityPost` | Tópico/post em comunidade |
| `CommunityPostComment` | Comentário em post de comunidade |
| `CommunityPostReaction` | Reação em post de comunidade |

---

## Autenticação

1. Usuário clica em "Continuar com Google"
2. Frontend redireciona para `GET /auth/google` (backend)
3. Google autentica e retorna para `GET /auth/google/callback`
4. Backend valida domínio `@grupootg.com`, cria/busca usuário
5. Backend redireciona para `<FRONTEND_URL>/auth/callback?token=<jwt>`
6. Frontend armazena token no localStorage via Zustand

**Restrição:** apenas emails `@grupootg.com` são aceitos.

---

## Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie ou selecione um projeto
3. Ative "Google Identity" / "Google+ API"
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Tipo: **Web Application**
6. Authorized redirect URIs: `http://localhost:3001/auth/google/callback`
7. Copie Client ID e Secret para o `.env`

---

## API — Endpoints principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/auth/google` | Inicia OAuth Google |
| GET | `/auth/me` | Usuário autenticado |
| GET | `/kudos/feed` | Feed paginado com `likedByMe` |
| POST | `/kudos` | Criar kudos (valida PointRule) |
| POST | `/kudos/:id/like` | Like / unlike |
| POST | `/kudos/:id/react` | Toggle reação |
| GET | `/kudos/:id/comments` | Comentários do post |
| POST | `/kudos/:id/comments` | Adicionar comentário |
| GET | `/kudos/categories` | Categorias ativas |
| GET | `/ranking/galacticos` | Top 10 mensal |
| GET | `/ranking/all-time` | Top 10 histórico |
| GET | `/social-profile/:id` | Perfil social completo |
| POST | `/social-profile/:id/vote` | Votar na reputação |
| GET | `/badges` | Catálogo de badges |
| GET | `/seasons/hall-of-fame` | Hall da Fama |
| GET | `/communities` | Lista comunidades |
| GET | `/communities/my` | Minhas comunidades |
| GET | `/communities/:slug` | Detalhe da comunidade |
| POST | `/communities` | Criar comunidade |
| POST | `/communities/:id/join` | Entrar na comunidade |
| POST | `/communities/:id/leave` | Sair da comunidade |
| GET | `/communities/:id/posts` | Posts da comunidade |
| POST | `/communities/:id/posts` | Criar post |
| GET | `/admin/stats` | Stats do dashboard admin |

Documentação Swagger completa: http://localhost:3001/api/docs

---

## Dados de Teste (Seed)

O seed popula o banco com dados realistas para teste:

- **Usuários:** `raphaelbraga@grupootg.com` (ADMIN) + colaboradores de exemplo
- **Departamentos:** Tecnologia, Produto, Marketing, Comercial, RH
- **Kudos:** Posts distribuídos com likes, reações e comentários
- **Badges:** 8 badges distribuídos entre usuários
- **Temporadas:** Abril/2026 (encerrada) + Maio/2026 (ativa)
- **Comunidades:** 12 comunidades com posts, comentários e membros

Para re-executar o seed (idempotente):

```bash
make seed
```

---

## Regras de negócio importantes

### PointRule (por categoria)
- `weeklyLimit`: máximo de kudos enviados nessa categoria por semana (segunda a domingo)
- `cooldownHours`: horas mínimas entre kudos do mesmo autor para o mesmo destinatário na mesma categoria
- Configurável pelo Admin em `/admin/rules`

### Comunidades

Plataforma de grupos internos inspirada no Orkut. Cada comunidade tem posts (tópicos), comentários e reações.

**Roles de membro:**

| Role | Permissões |
|------|-----------|
| `OWNER` | Tudo. Criado automaticamente para quem criou a comunidade. Não pode sair se for o único OWNER. |
| `MODERATOR` | Pode ocultar/remover posts. Atribuído pelo Admin. |
| `MEMBER` | Pode criar posts, comentar e reagir. |

**Fluxo do usuário:**

1. Acessar `/communities` — discover com busca, filtro por categoria e tabs (Todas / Minhas / Criadas)
2. Clicar "+ Participar" num card → vira MEMBER
3. Abrir a comunidade (`/communities/:slug`) → layout 2 colunas: sidebar com owner/moderadores/membros + feed de tópicos
4. Criar tópico (só membros) → aparece no feed da comunidade
5. Reagir (🔥🚀❤️👏🧠) e comentar em tópicos
6. Clicar "Criar comunidade" → dialog com nome (slug gerado automaticamente) e categoria

**Visibilidade:**

- `PUBLIC` — qualquer usuário logado pode ver e entrar
- `PRIVATE` — reservado para V2 (join por convite)

**Status de comunidade (Admin):**

- `ACTIVE` — visível e operacional
- `INACTIVE` — visível mas sem novas interações
- `ARCHIVED` — oculta

**Onde aparece:**

- `/communities` — página de discovery
- `/communities/:slug` — detalhe da comunidade
- `/feed` → sidebar widget "Comunidades" (mostra as suas; fallback top-5 gerais)
- `/profile` → seção "Comunidades" na sidebar do próprio perfil
- `/admin/communities` → moderação de status e toggle oficial

### ProfileVisit
- Máximo 1 registro por visitante por perfil a cada 24h
- Visitar próprio perfil não registra

---

## QA

Ver [V1_QA_CHECKLIST.md](V1_QA_CHECKLIST.md) para 119 cenários de teste manual cobrindo Auth, Feed, Kudos, Comunidades, Admin, Seeds, Responsividade e Segurança.

Ver [V1_AUDIT.md](V1_AUDIT.md) para auditoria técnica detalhada com status de cada módulo.

---

Feito com ❤️ por OTG Engineering
