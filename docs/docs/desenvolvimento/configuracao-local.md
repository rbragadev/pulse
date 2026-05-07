---
id: configuracao-local
title: Configuração Local
sidebar_position: 1
---

# 🛠️ Configuração Local

Este guia explica como rodar o Pulse localmente para desenvolvimento ou testes.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Como verificar |
|-----------|-------------|---------------|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| Docker | 20.x | `docker --version` |
| Docker Compose | 2.x | `docker compose version` |
| Git | qualquer | `git --version` |

---

## Clonar o repositório

```bash
git clone https://github.com/rbragadev/pulse.git
cd pulse
```

---

## Estrutura de diretórios

```
pulse/
├── backend/          # NestJS API (porta 3001)
├── frontend/         # React + Vite (porta 5173)
├── docs/             # Esta documentação (porta 3002)
├── docker-compose.yml
└── Makefile
```

---

## Subir o banco de dados (PostgreSQL)

O PostgreSQL roda em Docker. Para iniciá-lo:

```bash
docker compose up -d
```

Isso sobe o container `pulse_db` com:
- **Host:** `localhost`
- **Porta:** `5432`
- **Database:** `pulse_db`
- **Usuário:** `pulse`
- **Senha:** `pulse`

---

## Variáveis de ambiente

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://pulse:pulse@localhost:5432/pulse_db"
JWT_SECRET="seu-secret-jwt-muito-seguro-aqui"
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL="http://localhost:3001"
VITE_GOOGLE_CLIENT_ID="seu-google-client-id"
```

:::warning Google OAuth
Para que o login funcione localmente, você precisa de credenciais de OAuth no Google Cloud Console. Configure o `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`. Adicione `http://localhost:3001/auth/google/callback` como URI de redirecionamento autorizado.
:::

---

## Instalar dependências

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install

# Docs (opcional)
cd ../docs && npm install
```

---

## Executar migrations e seed

```bash
cd backend

# Rodar migrations
npx prisma migrate dev

# Popular com dados de desenvolvimento
npx ts-node prisma/seed.ts
```

---

## Rodar em desenvolvimento

### Comando único (recomendado)

```bash
# Da raiz do projeto
make dev
```

Isso inicia backend e frontend simultaneamente.

### Manualmente

```bash
# Terminal 1 — Backend
cd backend && npm run start:dev

# Terminal 2 — Frontend
cd frontend && npm run dev

# Terminal 3 — Docs (opcional)
cd docs && npm start
```

---

## URLs de acesso

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:5173 | Aplicação principal |
| Backend API | http://localhost:3001 | API REST |
| Docs | http://localhost:3002 | Esta documentação |
| PostgreSQL | localhost:5432 | Banco de dados |

---

## Comandos úteis do Makefile

```bash
make dev        # Inicia backend + frontend
make setup      # Migrations + seed + dev
make db         # Sobe apenas o PostgreSQL
make stop       # Para todos os containers
```

---

## Resetar o banco de dados

:::danger Atenção — Dados serão perdidos
Este comando apaga todo o banco e recria com os dados do seed.
:::

```bash
cd backend
npx prisma migrate reset
npx ts-node prisma/seed.ts
```
