---
id: badges
title: Regras de Badges
sidebar_position: 4
---

# 🏅 Regras de Negócio — Badges

---

## Modelo de dados

```prisma
model Badge {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  icon        String      // emoji
  color       String      // hex color
  rarity      BadgeRarity
  userBadges  UserBadge[]
}

enum BadgeRarity {
  COMMON      // ⚪ Comum
  UNCOMMON    // 🟢 Incomum
  RARE        // 🔵 Rara
  EPIC        // 🟣 Épica
  LEGENDARY   // 🟡 Lendária
}

model UserBadge {
  id        String   @id @default(cuid())
  userId    String
  badgeId   String
  awardedAt DateTime @default(now())
  awardedBy String?  // admin que concedeu

  @@unique([userId, badgeId])  // 1 badge por usuário
}
```

---

## Regras de atribuição

| Regra | Detalhe |
|-------|---------|
| Quem pode atribuir | Apenas ADMIN |
| Um colaborador pode receber a mesma badge? | Não — constraint `@@unique([userId, badgeId])` |
| Pode revogar uma badge? | Sim, pelo admin (remover o registro de UserBadge) |
| Notificação ao receber | Em breve (V2) |

---

## Catálogo de badges V1

| Slug | Nome | Raridade | Critério sugerido |
|------|------|----------|------------------|
| `rising-star` | Rising Star | ⚪ COMMON | Novo colaborador com bom engajamento inicial |
| `team-player` | Team Player | ⚪ COMMON | Referência de colaboração no time |
| `inovador` | Inovador | 🟢 UNCOMMON | Ideias implementadas com impacto |
| `galactico-do-mes` | Galáctico do Mês | 🔵 RARE | 1º lugar no ranking mensal |
| `mais-querido` | Mais Querido | 🔵 RARE | Top em curtidas e reações recebidas |
| `mentor` | Mentor | 🟢 UNCOMMON | Desenvolvimento de outros colaboradores |
| `mvp` | MVP | 🟣 EPIC | Most Valuable Player da temporada |
| `lenda-otg` | Lenda OTG | 🟡 LEGENDARY | Legado impecável na empresa |

---

## Exibição no perfil

- Ordenadas da **mais rara** para a **mais comum**
- A badge mais rara tem destaque visual
- Hover mostra nome + descrição completa
- Badges Épicas e Lendárias têm animação de brilho (em V2)

---

## Endpoints

```
GET  /badges                        Lista todas as badges disponíveis
GET  /badges/user/:userId           Badges de um usuário específico
POST /admin/badges/award            Atribui badge a um usuário
     Body: { userId, badgeId }
DELETE /admin/badges/:userBadgeId   Remove badge de um usuário
```
