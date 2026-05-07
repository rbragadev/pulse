---
id: comunidades
title: Comunidades
sidebar_position: 8
---

# 👥 Comunidades

Comunidades são **grupos temáticos** dentro do Pulse onde colaboradores com interesses, projetos ou áreas em comum se reúnem para trocar ideias, criar tópicos e interagir entre si.

---

## O que é uma Comunidade?

Inspiradas no Orkut, as Comunidades do Pulse são espaços semi-autônomos com feed próprio, membros e moderação. Cada colaborador pode participar de quantas comunidades quiser e criar as suas próprias.

---

## Estrutura de uma Comunidade

| Elemento | Descrição |
|----------|-----------|
| **Nome** | Identificador humano legível |
| **Slug** | URL amigável gerado automaticamente (ex: `devs-otg`) |
| **Categoria** | Tecnologia, Cultura, Social, Esportes, etc. |
| **Visibilidade** | `PUBLIC` — qualquer membro autenticado pode entrar |
| **Status** | `ACTIVE`, `INACTIVE` ou `ARCHIVED` (gerenciado pelo Admin) |
| **isOfficial** | Badge de comunidade oficial (atribuído pelo Admin) |

---

## Roles de membro

| Role | Quem é | Permissões |
|------|--------|------------|
| `OWNER` | Criador da comunidade | Tudo. Não pode sair se for o único OWNER. |
| `MODERATOR` | Atribuído pelo Admin | Pode ocultar e remover posts |
| `MEMBER` | Qualquer um que entrou | Pode criar posts, comentar e reagir |

:::info Owner automático
Quem cria uma comunidade se torna `OWNER` automaticamente. É o único role que não pode sair enquanto for o único com essa role — garantia de que toda comunidade sempre tem um responsável.
:::

---

## Status de uma Comunidade

| Status | O que significa |
|--------|----------------|
| `ACTIVE` | Visível e com todas as interações habilitadas |
| `INACTIVE` | Visível mas sem novas interações (posts/comentários bloqueados) |
| `ARCHIVED` | Oculta para colaboradores, acessível apenas via Admin |

---

## O que acontece dentro de uma Comunidade?

- **Posts (tópicos):** Qualquer membro pode abrir um tópico para debate ou compartilhamento
- **Reações:** 5 tipos (🔥🚀❤️👏🧠) em cada post, com toggle
- **Comentários:** Threads de comentários em cada post
- **Membros:** Lista de owner, moderadores e membros recentes visível na sidebar

---

## Descoberta de Comunidades

A página `/communities` oferece:
- **Busca em tempo real** por nome de comunidade
- **Filtro por categoria**
- **Tabs:** Todas / Minhas comunidades / Criadas por mim
- **Hero stats:** total de comunidades, membros e posts da plataforma
