---
id: ranking
title: Regras de Ranking
sidebar_position: 2
---

# 📊 Regras de Negócio — Ranking

---

## Cálculo de pontos

```typescript
// Pseudocódigo da lógica de pontuação
function calcularPontos(categoria: Categoria): number {
  return 10 * categoria.weight;
}

// Ranking de um colaborador
function rankingPontos(userId: string, temporadaId: string): number {
  const kudosRecebidos = buscarKudos({ recipientId: userId, temporada: temporadaId });
  return kudosRecebidos.reduce((total, kudos) => {
    return total + calcularPontos(kudos.categoria);
  }, 0);
}
```

---

## Regras de temporada

| Regra | Detalhe |
|-------|---------|
| Apenas 1 temporada ativa por vez | Validado pelo backend |
| Início da temporada | Configurado manualmente pelo admin |
| Encerramento | Manual pelo admin (ou futuro: por data) |
| Reset de pontos mensais | Ao criar nova temporada, pontos do período anterior são "arquivados" |
| Pontos gerais | Nunca resetados — soma histórica de todas as temporadas |

---

## Ranking mensal vs. geral

### Mensal (temporada ativa)
```sql
SELECT u.*, SUM(10 * c.weight) as points
FROM kudos_posts k
JOIN categories c ON c.id = k.categoryId
JOIN users u ON u.id = k.recipientId
WHERE k.createdAt BETWEEN temporada.startDate AND NOW()
GROUP BY u.id
ORDER BY points DESC
```

### Geral (all-time)
```sql
SELECT u.*, SUM(10 * c.weight) as points, COUNT(k.id) as kudosReceived
FROM kudos_posts k
JOIN categories c ON c.id = k.categoryId
JOIN users u ON u.id = k.recipientId
GROUP BY u.id
ORDER BY points DESC
```

---

## Regras de desempate

Em ordem de prioridade:

1. **Mais pontos totais** (regra primária)
2. **Mais kudos recebidos** (quantidade, não pontos)
3. **Maior diversidade de remetentes** (kudos de mais autores diferentes)
4. **Data de cadastro mais antiga** (quem chegou primeiro)

---

## Visibilidade das posições

| Tela | Exibe |
|------|-------|
| Galácticos | Top completo (pódio + lista ilimitada) |
| Feed (widget) | Top 5 ao vivo |
| Hall da Fama | Campeão de cada temporada encerrada |
| Perfil do usuário | Posição atual no ranking mensal |

---

## Endpoints de ranking

```
GET /ranking/galacticos          Top mensal (temporada ativa)
GET /ranking/all-time            Ranking histórico completo
GET /seasons/active              Temporada ativa atual
GET /seasons                     Todas as temporadas (inclui encerradas)
```

---

## Considerações de performance

:::info Otimização
O ranking é calculado em tempo real via query SQL agregada com índices em `recipientId` e `createdAt`. Para bases grandes (>10k kudos), considerar cache com TTL de 5 minutos nos endpoints de ranking.
:::
