---
id: arquitetura
title: Arquitetura Técnica
sidebar_position: 2
---

# 🏗️ Arquitetura Técnica

---

## Visão geral do sistema

```
┌─────────────────────────────────────────────────────────┐
│                       PULSE V1                          │
│                                                         │
│  ┌──────────────┐      ┌──────────────────────────┐    │
│  │   Frontend   │ HTTP │      Backend (API)        │    │
│  │  React + Vite│ ───► │  NestJS + Prisma          │    │
│  │  porta 5173  │      │  porta 3001               │    │
│  └──────────────┘      └────────────┬─────────────┘    │
│                                     │                   │
│                              ┌──────▼──────┐            │
│                              │  PostgreSQL  │            │
│                              │  porta 5432  │            │
│                              │  (Docker)    │            │
│                              └─────────────┘            │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 18 | UI framework |
| TypeScript | 5.x | Tipagem estática |
| Vite | 5.x | Build tool e dev server |
| Tailwind CSS | 3.x | Estilização utility-first |
| React Query | 5.x | Cache e sincronização de dados |
| Zustand | 4.x | Estado global (auth) |
| React Router | 6.x | Roteamento SPA |
| Axios | 1.x | Cliente HTTP |
| shadcn/ui | — | Componentes base acessíveis |
| Lucide React | — | Ícones |

### Estrutura de diretórios (frontend)

```
frontend/src/
├── App.tsx              # Router principal
├── main.tsx             # Entry point
├── components/
│   ├── layout/          # AppLayout, Header, Sidebar
│   ├── shared/          # KudosCard, UserAvatar, FeedComposer...
│   ├── ui/              # Componentes shadcn (Button, Input...)
│   └── widgets/         # SeasonWidget, BirthdaysWidget...
├── hooks/               # useAuth, useToast
├── lib/                 # api.ts (Axios), utils.ts
├── pages/               # Uma pasta por tela
├── store/               # auth.store.ts (Zustand)
└── types/               # index.ts — todos os tipos TypeScript
```

### Padrão de dados da API

O backend envolve **todas** as respostas no `TransformInterceptor`:

```typescript
// Toda resposta da API tem este formato:
{
  data: T,           // O dado real
  timestamp: string  // ISO timestamp da resposta
}

// Frontend usa este padrão para desembrulhar:
api.get('/endpoint').then((r) => r.data?.data)
//                             ↑ axios  ↑ TransformInterceptor
```

---

## Backend

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| NestJS | 10.x | Framework Node.js |
| TypeScript | 5.x | Tipagem estática |
| Prisma | 5.x | ORM e migrations |
| PostgreSQL | 15 | Banco de dados relacional |
| Passport.js | — | Autenticação Google OAuth |
| JWT | — | Tokens de sessão |
| class-validator | — | Validação de DTOs |

### Módulos do backend

```
backend/src/
├── app.module.ts        # Módulo raiz
├── main.ts              # Bootstrap + CORS + filtros globais
├── auth/                # OAuth Google + JWT
│   ├── strategies/      # google.strategy, jwt.strategy
│   ├── guards/          # jwt-auth.guard, roles.guard
│   └── decorators/      # @CurrentUser(), @Roles()
├── kudos/               # CRUD de kudos, feed, likes, reações, comentários
├── users/               # Gestão de usuários
├── departments/         # Departamentos
├── ranking/             # Cálculo de ranking mensal e geral
├── admin/               # Endpoints exclusivos do admin
├── badges/              # Badges e UserBadges
├── achievements/        # Conquistas e UserAchievements
├── seasons/             # Temporadas
├── social-profile/      # Votos de reputação
├── prisma/              # PrismaService (singleton)
└── common/
    ├── filters/         # HttpExceptionFilter (respostas de erro)
    └── interceptors/    # TransformInterceptor (wrapper de resposta)
```

---

## Banco de Dados

### Principais entidades

```
User ──────────────────────────────────┐
  id, name, email, avatar              │
  role (USER|ADMIN), isActive          │
  departmentId                         │
                                       │
KudosPost ─────────────────────────────┤
  id, message, authorId, recipientId   │
  categoryId, isHidden, createdAt      │
                                       │
KudosLike → (userId, postId)           │
KudosReaction → (userId, postId, type) │
KudosComment → (postId, authorId, msg) │
                                       │
Badge, UserBadge ──────────────────────┤
Achievement, UserAchievement ──────────┤
Season, SeasonRanking ─────────────────┤
ProfileVote (reputação social) ────────┘
```

---

## Autenticação

```
1. Frontend → GET /auth/google
2. Backend redireciona → Google OAuth
3. Callback → /auth/google/callback
4. Backend valida domínio @grupootg.com
5. Backend upsert User no banco
6. Backend gera JWT (7 dias)
7. Backend redireciona → frontend com token
8. Frontend salva token no localStorage
9. Todas as requests incluem: Authorization: Bearer <token>
```

---

## Convenções de código

| Convenção | Descrição |
|-----------|-----------|
| DTOs com class-validator | Toda entrada de dados é validada |
| Módulos isolados | Cada feature tem seu módulo NestJS |
| Repositórios | Kudos e Users têm repositórios separados do service |
| TransformInterceptor | Todas as respostas são envolvidas automaticamente |
| Guards globais | `JwtAuthGuard` é global; `RolesGuard` onde necessário |
