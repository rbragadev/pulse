---
id: galacticos
title: Tela de Galácticos
sidebar_position: 4
---

# 🌟 Tela de Galácticos

A tela de Galácticos exibe o ranking completo de colaboradores da OTG, com pódio olímpico visual e lista completa. É a vitrine de reconhecimento da empresa.

---

## Abas de navegação

| Aba | Dados exibidos | Reset |
|-----|---------------|-------|
| **Este mês** | Pontos acumulados na temporada ativa | Mensal |
| **Geral** | Histórico completo de pontos | Nunca |

---

## Pódio Olímpico

Os 3 primeiros são exibidos em formato de pódio:

```
          🥇  [1º lugar]
        ┌──────────────┐
    🥈  │  Avatar GG   │  🥉
  ┌────┐│  Nome        │┌────┐
  │Av. ││  Dept.       ││Av. │
  │Nome││  87 pontos   ││Nome│
  └────┘└──────────────┘└────┘
  2º lugar              3º lugar
```

Ordem olímpica: **2º (esquerda) — 1º (centro, maior) — 3º (direita)**

### Cores por posição

| Posição | Medalha | Cor de fundo | Cor do score |
|---------|---------|-------------|-------------|
| 1º 🥇 | Ouro | Amarelo/10% | Amarelo |
| 2º 🥈 | Prata | Cinza/10% | Cinza claro |
| 3º 🥉 | Bronze | Âmbar/10% | Âmbar |

Todos os cards do pódio são **links clicáveis** para o perfil do colaborador.

---

## Lista (4º em diante)

A partir da 4ª posição, o ranking é exibido como uma lista horizontal com:
- Posição numérica
- Avatar
- Nome + departamento
- Total de kudos recebidos (com label "kudos")

Cada item também é um **link** para o perfil do colaborador.

---

## Estado vazio

Se não há dados para o período selecionado, exibe uma mensagem motivacional pedindo para o colaborador enviar o primeiro reconhecimento.

---

## Widget "Ao Vivo" no Feed

Um preview do ranking aparece no widget da sidebar do feed, mostrando o Top 5 com a badge verde "Ao Vivo". Esse widget é atualizado a cada carregamento da página.
