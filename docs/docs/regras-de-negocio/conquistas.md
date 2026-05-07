---
id: conquistas
title: Regras de Conquistas
sidebar_position: 5
---

# 🎯 Regras de Negócio — Conquistas

---

## Modelo de dados

```prisma
model Achievement {
  id               String           @id @default(cuid())
  name             String
  slug             String           @unique
  description      String
  icon             String
  userAchievements UserAchievement[]
}

model UserAchievement {
  id            String      @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime    @default(now())

  @@unique([userId, achievementId])
}
```

---

## Catálogo de conquistas V1

| Slug | Nome | Ícone | Critério |
|------|------|-------|---------|
| `primeiro-passo` | Primeiro Passo | 👋 | Enviou o primeiro kudos |
| `reconhecido` | Reconhecido! | ⭐ | Recebeu o primeiro kudos |
| `conectado` | Conectado | 🤝 | Enviou kudos para 5 pessoas diferentes |
| `embaixador` | Embaixador | 🌟 | Enviou 10 kudos no total |
| `muito-amado` | Muito Amado | ❤️ | Recebeu 20 kudos no total |
| `top-3` | Top 3 | 🏆 | Entrou no top 3 do ranking mensal |
| `comentarista` | Comentarista | 💬 | Fez 5 comentários no feed |
| `reativo` | Reativo | 🔥 | Deu 10 reações em kudos |

---

## Regras de desbloqueio

| Regra | Detalhe |
|-------|---------|
| Quando verificar | Após qualquer ação relevante (enviar kudos, comentar, reagir) |
| Como desbloquear | Automático pelo sistema (via triggers no serviço) |
| Uma conquista por usuário | Sim — `@@unique([userId, achievementId])` |
| Pode perder a conquista? | Não — são permanentes |
| Retroativo? | Sim — o seed atribui conquistas com base em dados históricos |

---

## Verificação automática (V1)

No V1, as conquistas são atribuídas **no seed** com base nos dados existentes. Em V2, será um sistema de triggers que verifica após cada ação.

**Lógica de verificação (pseudocódigo):**

```typescript
async function verificarConquistas(userId: string) {
  const stats = await getUserStats(userId);
  
  if (stats.kudosSent >= 1)       await award(userId, 'primeiro-passo');
  if (stats.kudosReceived >= 1)   await award(userId, 'reconhecido');
  if (stats.uniqueRecipients >= 5) await award(userId, 'conectado');
  if (stats.kudosSent >= 10)      await award(userId, 'embaixador');
  if (stats.kudosReceived >= 20)  await award(userId, 'muito-amado');
  if (stats.comments >= 5)        await award(userId, 'comentarista');
  if (stats.reactions >= 10)      await award(userId, 'reativo');
}
```

---

## Endpoints

```
GET  /achievements                     Lista todas as conquistas
GET  /achievements/user/:userId        Conquistas de um usuário
```
