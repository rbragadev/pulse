---
id: reputacao-social
title: Regras de Reputação Social
sidebar_position: 3
---

# 🌐 Regras de Negócio — Reputação Social

---

## Votação

| Regra | Detalhe |
|-------|---------|
| Quem pode votar | Qualquer usuário autenticado |
| Auto-voto | Proibido — backend valida `voterId !== targetId` |
| Limite por dimensão | 1 voto por dimensão, por votante, por usuário-alvo |
| Retirar voto | Não é possível retirar um voto já dado |
| Anonimato | Os votos são anônimos para o dono do perfil |

---

## Dimensões disponíveis

```typescript
enum VoteType {
  TRUSTWORTHY = 'TRUSTWORTHY',   // 🛡️ Confiável
  NICE        = 'NICE',          // 😊 Legal
  PROFESSIONAL = 'PROFESSIONAL', // 💼 Profissional
}
```

---

## Modelo de dados

```prisma
model ProfileVote {
  id        String   @id @default(cuid())
  voterId   String                          // quem votou
  targetId  String                          // quem recebeu
  voteType  VoteType                        // dimensão
  createdAt DateTime @default(now())

  @@unique([voterId, targetId, voteType])   // 1 voto por dimensão
}
```

---

## Exibição no perfil

Para cada dimensão, o perfil exibe:
1. Total de votos recebidos naquela dimensão
2. Barra de progresso relativa ao máximo entre as 3 dimensões
3. Se o visitante já votou naquela dimensão (estado de botão alterado)

---

## Impacto nos dados

- Os votos de reputação são **independentes** do ranking de pontos
- Não afetam badges nem conquistas (V1)
- Alimentam um índice qualitativo disponível para People no Analytics

---

## API

```
GET  /social-profile/:userId/reputation    Dados de reputação do usuário
POST /social-profile/:userId/vote          Registra um voto
     Body: { voteType: "TRUSTWORTHY" | "NICE" | "PROFESSIONAL" }
```
