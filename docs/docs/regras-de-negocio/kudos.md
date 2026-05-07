---
id: kudos
title: Regras de Kudos
sidebar_position: 1
---

# ⚙️ Regras de Negócio — Kudos

Esta seção documenta todas as regras de negócio do sistema de kudos para referência do time de People e desenvolvimento.

---

## Quem pode enviar?

| Condição | Pode enviar? |
|---------|------------|
| Usuário ativo com role USER | ✅ |
| Usuário ativo com role ADMIN | ✅ |
| Usuário inativo (desativado) | ❌ |
| Usuário não autenticado | ❌ |

---

## Quem pode receber?

| Condição | Pode receber? |
|---------|-------------|
| Qualquer usuário ativo | ✅ |
| O próprio usuário (auto-kudos) | ❌ |
| Usuário inativo | ❌ |

:::warning Auto-kudos bloqueado
O backend valida que `authorId !== recipientId`. Tentativas de auto-kudos retornam HTTP 400.
:::

---

## Campos obrigatórios

| Campo | Tipo | Validação |
|-------|------|-----------|
| `recipientId` | UUID | Usuário ativo existente |
| `message` | String | Mínimo 10 caracteres, máximo 1000 |
| `categoryId` | UUID | Categoria ativa existente |

---

## Categorias e seus pesos

| Categoria | Slug | Peso | Pontos gerados |
|-----------|------|------|---------------|
| Trabalho em Equipe | `trabalho-equipe` | 1.0 | 10 pts |
| Inovação | `inovacao` | 1.5 | 15 pts |
| Liderança | `lideranca` | 1.5 | 15 pts |
| Resultado | `resultado` | 1.2 | 12 pts |
| Cliente | `cliente` | 1.3 | 13 pts |
| Cultura | `cultura` | 1.0 | 10 pts |

**Fórmula:** `pontos = 10 × peso_categoria`

---

## Visibilidade

- Todos os kudos são **públicos** para usuários autenticados
- Admins podem **ocultar** kudos (sem excluir permanentemente)
- Kudos ocultos não aparecem no feed mas são preservados no banco de dados

---

## Limitações anti-spam

:::info Regras atuais (V1)
O Pulse V1 não tem limite rígido de kudos por dia. O monitoramento é feito pelo People via analytics.
:::

**Comportamentos monitorados:**
- Enviar mais de 5 kudos por dia para a mesma pessoa
- Kudos com mensagens idênticas em sequência
- Padrões de troca recíproca suspeita (A ↔ B repetidamente)

**Em versões futuras:**
- Limite configurável de X kudos por dia
- Detecção automática de padrões
- Sistema de denúncia

---

## Reações ao Kudos

| Tipo | Emoji | Slug |
|------|-------|------|
| Fogo | 🔥 | `FIRE` |
| Foguete | 🚀 | `ROCKET` |
| Coração | ❤️ | `HEART` |
| Palmas | 👏 | `CLAP` |
| Cérebro | 🧠 | `BRAIN` |

**Regras:**
- 1 reação de cada tipo por usuário por kudos
- Clicar novamente remove a reação (toggle)
- Reações não geram pontos no ranking

---

## API endpoints principais

```
GET    /kudos/feed?page=1&limit=20     Lista o feed paginado
POST   /kudos                          Cria um novo kudos
GET    /kudos/:id                      Detalhes de um kudos
POST   /kudos/:id/reactions            Adiciona/remove reação
POST   /kudos/:id/comments             Adiciona comentário
POST   /kudos/:id/like                 Curte/descurte
```
