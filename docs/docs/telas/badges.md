---
id: badges
title: Tela de Badges
sidebar_position: 6
---

# 🏅 Tela de Badges

A tela de Badges é o painel de colecionamento de cada colaborador. Mostra todas as badges disponíveis e o progresso das conquistas.

---

## Seções da tela

### Badges conquistadas

Grade de cards com todas as badges que o colaborador **já possui**. Cada card exibe:
- Ícone da badge (emoji)
- Nome
- Raridade (com cor correspondente)
- Descrição curta

### Badges disponíveis (não conquistadas)

Cards em tom acinzentado com cadeado 🔒, mostrando:
- Ícone obscurecido
- Nome
- Raridade
- O que é preciso para conquistar

### Conquistas — Timeline

Lista cronológica das conquistas desbloqueadas:
- Data de desbloqueio
- Ícone + nome
- Descrição do que foi feito

Conquistas pendentes aparecem abaixo com barra de progresso (quando disponível).

---

## Cores por raridade

| Raridade | Cor do card | Borda |
|----------|------------|-------|
| ⚪ Comum | Cinza neutro | Borda sutil |
| 🟢 Incomum | Verde/10% | Verde/30% |
| 🔵 Rara | Azul/10% | Azul/30% |
| 🟣 Épica | Roxo/10% | Roxo/30% |
| 🟡 Lendária | Dourado/10% + brilho | Dourado/40% |

---

## Estado de progresso visual

```
Badges:    [🚀][🤝][💡][🔒][🔒][🔒][🔒][🔒]
           conquistadas     ↑ bloqueadas

Conquistas: 
✅ Primeiro Passo    — 01/04/2026
✅ Reconhecido!      — 03/04/2026
✅ Conectado         — 12/04/2026
🔒 Embaixador        — Envie 10 kudos (3/10)
🔒 Muito Amado       — Receba 20 kudos (7/20)
```

---

## Rota

- Menu lateral → **Award "Badges"**
- Rota: `/badges`

:::info Visualizando badges de outro colaborador
As badges de qualquer colaborador também são visíveis no perfil deles — não apenas na própria tela de Badges.
:::
