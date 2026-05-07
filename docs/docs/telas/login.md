---
id: login
title: Tela de Login
sidebar_position: 1
---

# 🔐 Tela de Login

A tela de login é o ponto de entrada do Pulse. Ela foi projetada para ser minimalista e segura, refletindo a identidade visual da plataforma.

---

## Layout

```
┌─────────────────────────────────────┐
│                                     │
│           ⚡  PULSE                 │
│    Reconhecimento OTG               │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🔵  Entrar com Google        │  │
│  └───────────────────────────────┘  │
│                                     │
│  Apenas contas @grupootg.com        │
│                                     │
└─────────────────────────────────────┘
```

---

## Componentes da tela

| Elemento | Função |
|---------|--------|
| Logo ⚡ Pulse | Identidade visual da plataforma |
| Tagline | "Reconhecimento OTG" |
| Botão Google | Inicia o fluxo OAuth 2.0 |
| Aviso de domínio | Indica que apenas @grupootg.com tem acesso |

---

## Fluxo técnico do login

```
Usuário clica "Entrar com Google"
        ↓
Frontend → GET /auth/google
        ↓
Backend redireciona para Google OAuth
        ↓
Usuário autoriza no Google
        ↓
Google → callback → /auth/google/callback
        ↓
Backend valida domínio @grupootg.com
        ↓
Backend gera JWT token
        ↓
Frontend recebe token + dados do usuário
        ↓
Redirecionado para /feed
```

---

## Redirecionamento pós-login

Após autenticação bem-sucedida, o usuário é redirecionado para:
- `/feed` — se for o primeiro acesso ou acesso normal
- A página que tentou acessar antes — se tentou acessar uma rota protegida sem autenticação
