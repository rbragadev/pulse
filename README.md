# Pulse — OTG Internal Recognition Platform

Plataforma interna de reconhecimento entre colaboradores da OTG. Feed social de kudos, ranking gamificado "Galácticos" e painel administrativo.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui |
| Estado | Zustand + TanStack Query |
| Backend | NestJS + Prisma ORM |
| Banco | PostgreSQL 16 |
| Auth | Google OAuth2 + JWT |
| Infra | Docker Compose |

---

## Setup Rápido

### Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- Credenciais Google OAuth ([console.cloud.google.com](https://console.cloud.google.com))

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha no `.env`:

```env
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
JWT_SECRET=uma-chave-secreta-forte
```

### 2. Setup completo (primeira vez)

```bash
make setup
```

Isso instala dependências, sobe o banco, executa migrations e popula com dados de exemplo.

### 3. Iniciar em desenvolvimento

```bash
make dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

---

## Comandos Disponíveis

```bash
make install      # Instala dependências (backend + frontend)
make dev          # Inicia em modo desenvolvimento
make backend      # Inicia apenas o backend
make frontend     # Inicia apenas o frontend
make db-up        # Sobe o PostgreSQL
make db-down      # Para o PostgreSQL
make db-migrate   # Executa migrations do Prisma
make seed         # Popula banco com dados mockados
make lint         # Executa linting
make build        # Build de produção
make docker-up    # Sobe todos os serviços via Docker
make docker-down  # Para todos os serviços
```

---

## Estrutura do Projeto

```
pulse/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/            # Autenticação Google OAuth + JWT
│   │   ├── users/           # Módulo de usuários
│   │   ├── kudos/           # Feed + posts + likes + categorias
│   │   ├── ranking/         # Galácticos (ranking mensal e geral)
│   │   ├── departments/     # Departamentos
│   │   ├── admin/           # Backoffice
│   │   ├── prisma/          # PrismaService
│   │   └── common/          # Interceptors + filters
│   └── prisma/
│       ├── schema.prisma    # Models do banco
│       └── seed.ts          # Dados de exemplo
├── frontend/                # App React
│   └── src/
│       ├── components/      # UI + Layout + Shared
│       ├── pages/           # Páginas da aplicação
│       ├── store/           # Zustand (auth)
│       ├── hooks/           # Custom hooks
│       ├── lib/             # API client + utils
│       └── types/           # TypeScript types
├── docker-compose.yml
├── Makefile
└── .env.example
```

---

## Banco de Dados

### Models

| Model | Descrição |
|-------|-----------|
| `User` | Colaborador com role USER/ADMIN |
| `Department` | Departamento da empresa |
| `KudosPost` | Post de reconhecimento |
| `KudosCategory` | Categoria do reconhecimento |
| `KudosLike` | Like em um post |

---

## Autenticação

O fluxo é:

1. Usuário clica em "Continuar com Google"
2. Frontend redireciona para `/auth/google` (backend)
3. Google autentica e retorna para `/auth/google/callback`
4. Backend valida domínio `@grupootg.com`, cria/busca usuário
5. Backend redireciona para `<FRONTEND_URL>/auth/callback?token=<jwt>`
6. Frontend armazena token no localStorage via Zustand

---

## Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto ou selecione um existente
3. Ative a "Google+ API" ou "Google Identity"
4. Em "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Tipo: **Web Application**
6. Authorized redirect URIs: `http://localhost:3001/auth/google/callback`
7. Copie Client ID e Client Secret para o `.env`

---

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/auth/google` | Inicia OAuth Google |
| GET | `/auth/google/callback` | Callback OAuth |
| GET | `/auth/me` | Usuário autenticado |
| GET | `/users` | Lista usuários |
| GET | `/users/:id` | Perfil do usuário |
| GET | `/kudos` | Feed de reconhecimentos |
| POST | `/kudos` | Criar reconhecimento |
| POST | `/kudos/:id/like` | Like/unlike |
| GET | `/kudos/categories` | Categorias |
| GET | `/ranking/monthly` | Ranking mensal |
| GET | `/ranking/all-time` | Ranking geral |
| GET | `/admin/stats` | Stats do dashboard |
| GET | `/admin/users` | Lista usuários (admin) |
| GET | `/admin/posts` | Lista posts (admin) |

Documentação completa em http://localhost:3001/api/docs

---

## Roadmap MVP

- [x] Autenticação Google OAuth (domínio @grupootg.com)
- [x] Feed de kudos com likes
- [x] Ranking Galácticos (mensal + geral)
- [x] Perfil de colaborador
- [x] Painel administrativo
- [x] Categorias de reconhecimento
- [x] Departamentos
- [ ] Notificações em tempo real (WebSocket)
- [ ] Badges e conquistas
- [ ] Integração com Slack
- [ ] Exportação de relatórios
- [ ] Comentários nos posts
- [ ] Filtros avançados no feed
- [ ] App mobile (React Native)

---

## Contribuindo

1. Crie uma branch: `git checkout -b feat/minha-feature`
2. Commit: `git commit -m 'feat: descrição da feature'`
3. Push: `git push origin feat/minha-feature`
4. Abra um Pull Request

---

Feito com por OTG Engineering
