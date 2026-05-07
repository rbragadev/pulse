---
id: comunidades
title: Tela de Comunidades
sidebar_position: 7
---

# 👥 Tela de Comunidades

O módulo de Comunidades é composto por duas telas principais: a página de **discovery** (`/communities`) e a página de **detalhe** (`/communities/:slug`).

---

## `/communities` — Discovery

### Hero stats
No topo da página, um banner exibe as métricas gerais da plataforma:
- Total de comunidades ativas
- Total de membros
- Total de posts publicados

### Busca e filtros

| Controle | Função |
|----------|--------|
| Campo de busca | Filtra por nome em tempo real |
| Seletor de categoria | Filtra por categoria (Tecnologia, Cultura, Social...) |
| Tab "Todas" | Todas as comunidades públicas ativas |
| Tab "Minhas" | Comunidades que o usuário é membro |
| Tab "Criadas por mim" | Comunidades criadas pelo usuário |

### Cards de comunidade

Cada card exibe:
- Avatar/ícone e nome da comunidade
- Categoria
- Descrição curta
- Contadores de membros e posts
- Badge "Oficial" (quando aplicável)
- Botão **"+ Participar"** ou **"✓ Participando"**

### Criar comunidade

O botão **"+ Criar comunidade"** abre um dialog com:
- Campo de nome (slug gerado automaticamente)
- Seleção de categoria
- Botão de confirmação

---

## `/communities/:slug` — Detalhe da Comunidade

Layout em **2 colunas** (estilo Orkut):

```
┌─────────────────────────┬──────────────────────┐
│  Feed de tópicos        │  Sidebar              │
│                         │                       │
│  [Formulário de post]   │  Avatar + stats       │
│  (só para membros)      │  Botão Entrar/Sair    │
│                         │                       │
│  Post 1                 │  Owner                │
│  ├─ Reações             │  Moderadores          │
│  └─ Comentários         │  Membros recentes     │
│                         │                       │
│  Post 2                 │                       │
│  ...                    │                       │
└─────────────────────────┴──────────────────────┘
```

### Sidebar da comunidade

- **Avatar e nome** da comunidade com contadores (membros / posts)
- **Botão Entrar/Sair** (oculto para o OWNER único)
- **Owner:** card com avatar e nome do criador
- **Moderadores:** lista com avatar e nome
- **Membros recentes:** grid de avatares dos últimos membros

### Feed de tópicos

- Posts em ordem cronológica decrescente
- Cada post exibe: autor, tempo relativo, título, conteúdo
- **Reações** (🔥🚀❤️👏🧠) com toggle
- **Comentários** expansíveis via clique no ícone

### Formulário de novo tópico

Visível apenas para membros. Ao clicar em **"Novo tópico"**:
- Campo de título
- Campo de conteúdo (textarea)
- Botão **"Publicar"**

Não-membros veem o feed mas não têm acesso ao formulário.

---

## Widget no Feed

A sidebar do feed exibe o widget **"Comunidades"**:
- Se o usuário é membro de alguma comunidade: exibe as suas comunidades
- Se não é membro de nenhuma: exibe as 5 comunidades mais populares (fallback)

Cada item tem o nome e um link direto para a comunidade.

---

## Responsividade

| Viewport | Comportamento |
|----------|--------------|
| Desktop (≥ 768px) | Layout 2 colunas na página de detalhe |
| Mobile (< 768px) | Sidebar empilha acima do feed |
| CommunitiesPage mobile | Grid de 1 coluna |
