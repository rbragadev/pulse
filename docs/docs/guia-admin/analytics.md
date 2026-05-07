---
id: analytics
title: Analytics e Relatórios
sidebar_position: 5
---

# 📊 Analytics e Relatórios

O painel de Analytics do Pulse oferece visibilidade sobre o engajamento da cultura de reconhecimento na OTG.

---

## Onde encontrar

**Admin** → **Analytics** (ou Dashboard principal)

---

## Métricas do Dashboard Principal

| Métrica | Descrição | Uso |
|---------|-----------|-----|
| Total de Usuários | Todos os colaboradores cadastrados | Base da empresa |
| Kudos este mês | Reconhecimentos publicados no mês atual | Saúde do engajamento |
| Usuários Ativos | Com pelo menos 1 ação nos últimos 30 dias | Taxa de adoção |
| Total de Likes | Soma de todas as curtidas | Engajamento passivo |

---

## Interpretando os dados

### Taxa de adoção

```
Taxa de adoção = (Usuários ativos / Total de usuários) × 100
```

| Taxa | Interpretação | Ação |
|------|--------------|------|
| < 20% | Baixa adoção | Campanha de conscientização + onboarding |
| 20–50% | Adoção moderada | Engajar lideranças como multiplicadores |
| 50–75% | Boa adoção | Manter momentum, reconhecer super-usuários |
| > 75% | Excelente | Documentar práticas e compartilhar internamente |

### Ritmo de reconhecimentos

| Kudos/semana | Interpretação |
|-------------|--------------|
| < 5 | Plataforma dormindo — ativar campanhas |
| 5–20 | Baixo mas crescendo |
| 20–50 | Engajamento saudável |
| > 50 | Cultura vibrante de reconhecimento |

---

## Análise por Departamento

Identifique quais times são mais ativos e quais precisam de atenção:

```
Engenharia      ████████████████  42 kudos
Produto         ████████████      34 kudos
Marketing       ████████          22 kudos
Comercial       ██████            16 kudos
People & RH     ████              10 kudos
```

:::tip Ação recomendada
Departamentos com baixo engajamento podem precisar de um "Embaixador Pulse" — alguém que incentive o time a reconhecer mais ativamente.
:::

---

## Métricas de qualidade

Além da quantidade, avalie a **qualidade** do engajamento:

| Indicador | Como medir | Meta |
|-----------|-----------|------|
| Comprimento médio das mensagens | Total chars / total kudos | > 100 chars |
| Kudos com comentários | % de kudos com pelo menos 1 comentário | > 30% |
| Diversidade de remetentes | Kudos de autores únicos por destinatário | > 5 pessoas |
| Reações por kudos | Total reações / total kudos | > 3 |

---

## Relatório mensal para liderança

Sugestão de formato para o relatório mensal de cultura:

```markdown
# Relatório Pulse — Maio 2026

## Resumo executivo
- 127 reconhecimentos enviados (+23% vs abril)
- 34 colaboradores ativos (68% do total)
- Top departamento: Engenharia (42 kudos)
- Colaborador mais reconhecido: Lucas Ferreira (47 pontos)

## Destaques
- Maior engajamento na semana do All Hands
- 5 colaboradores novos fizeram primeiro kudos
- 3 badges atribuídas (Rising Star x2, Team Player x1)

## Pontos de atenção
- Comercial teve queda de 40% em kudos vs. mês passado
- 12 usuários cadastrados nunca enviaram um kudos

## Próximos passos
- Workshop de cultura de reconhecimento com Comercial
- Campanha especial para usuários inativos
```

---

## Endpoints da API de analytics

```
GET /admin/stats              Estatísticas gerais
GET /admin/stats/departments  Kudos por departamento
GET /kudos/feed?limit=100    Export de kudos (filtrável)
```
