---
id: comunidades
title: Regras de Comunidades
sidebar_position: 6
---

# ⚙️ Regras de Negócio — Comunidades

Esta seção documenta as regras de negócio do módulo de Comunidades para referência do time de People e desenvolvimento.

---

## Quem pode criar uma comunidade?

| Condição | Pode criar? |
|---------|------------|
| Usuário ativo (USER ou ADMIN) | ✅ |
| Usuário inativo | ❌ |

Não há limite de comunidades criadas por usuário.

---

## Slug e unicidade

O slug é gerado automaticamente a partir do nome:
- Caracteres especiais e acentos são removidos (normalização Unicode)
- Espaços viram hífens
- Tudo em minúsculo

**Exemplo:** "Devs OTG Frontend" → `devs-otg-frontend`

:::warning Slugs são únicos
Tentar criar uma comunidade com um slug já existente retorna erro `409 Conflict`. O usuário pode editar manualmente o slug antes de criar.
:::

---

## Roles e permissões

| Ação | OWNER | MODERATOR | MEMBER | Não-membro |
|------|-------|-----------|--------|------------|
| Ver posts | ✅ | ✅ | ✅ | ✅ |
| Criar post | ✅ | ✅ | ✅ | ❌ |
| Comentar | ✅ | ✅ | ✅ | ❌ |
| Reagir | ✅ | ✅ | ✅ | ❌ |
| Ocultar/remover post | ✅ | ✅ | ❌ | ❌ |
| Sair da comunidade | ✅* | ✅ | ✅ | — |
| Alterar status da comunidade | ❌ | ❌ | ❌ | Admin |
| Marcar como oficial | ❌ | ❌ | ❌ | Admin |

*\* OWNER só pode sair se houver outro OWNER na comunidade.*

---

## Regra do sole-owner

Se um colaborador é o **único OWNER** de uma comunidade, ele não pode sair.

**Resposta da API:** `400 Bad Request` com mensagem `"You are the sole owner of this community"`

Para sair, ele deve:
1. Solicitar ao Admin que promova outro membro a OWNER, **ou**
2. Promover outro membro via Admin e então sair

---

## Status da comunidade

| Status | Visível para usuários | Novas interações |
|--------|-----------------------|-----------------|
| `ACTIVE` | ✅ | ✅ |
| `INACTIVE` | ✅ | ❌ |
| `ARCHIVED` | ❌ | ❌ |

O status só pode ser alterado pelo Admin em `/admin/communities`.

---

## Reações em posts de comunidade

- 5 tipos disponíveis: `FIRE`, `ROCKET`, `HEART`, `CLAP`, `BRAIN`
- **1 reação de cada tipo** por usuário por post
- Clicar na reação ativa remove (toggle)
- Reações **não geram pontos** no ranking de kudos

---

## Moderação de posts

Moderadores e Owners podem:
- **Ocultar** um post (`status: HIDDEN`) — post sai do feed mas permanece no banco
- **Remover** um post (`status: REMOVED`) — permanente, não pode ser restaurado via UI

Admins têm as mesmas capacidades via painel Admin.

---

## Visibilidade

O Pulse V1 suporta apenas comunidades `PUBLIC`. Qualquer usuário autenticado pode ver e entrar.

Comunidades `PRIVATE` (join por convite) estão planejadas para V2.

---

## Endpoints principais

```
GET    /communities                  Lista todas (paginado)
GET    /communities/my               Minhas comunidades (membro + owner)
GET    /communities/:slug            Detalhe da comunidade
POST   /communities                  Criar comunidade
POST   /communities/:id/join         Entrar na comunidade
POST   /communities/:id/leave        Sair da comunidade
GET    /communities/:id/posts        Posts da comunidade (paginado)
POST   /communities/:id/posts        Criar post
POST   /communities/posts/:id/reactions  Toggle reação em post
GET    /communities/posts/:id/comments   Lista comentários
POST   /communities/posts/:id/comments   Adicionar comentário
```
