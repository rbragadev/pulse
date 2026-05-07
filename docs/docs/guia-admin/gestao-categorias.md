---
id: gestao-categorias
title: Gestão de Categorias
sidebar_position: 3
---

# 🏷️ Gestão de Categorias

As categorias definem os **eixos de valor** do reconhecimento na OTG. Cada kudos precisa estar associado a uma categoria.

---

## Onde encontrar

**Admin** → **Categorias**

---

## Categorias padrão (V1)

| Categoria | Ícone | Peso | Ativa |
|-----------|-------|------|-------|
| Trabalho em Equipe | 🤝 | 1.0 | ✅ |
| Inovação | 💡 | 1.5 | ✅ |
| Liderança | 👑 | 1.5 | ✅ |
| Resultado | 📊 | 1.2 | ✅ |
| Cliente | 🎯 | 1.3 | ✅ |
| Cultura | 🌟 | 1.0 | ✅ |

---

## Criar nova categoria

**Quando criar:** Para campanhas especiais, trimestres de OKRs, eventos de onboarding, etc.

**Campos:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | String | Nome exibido no formulário de kudos |
| Ícone | Emoji | Exibido no card do kudos |
| Cor | Hex | Cor do badge de categoria |
| Peso | Decimal | Multiplicador de pontos (ex: 1.0, 1.5, 2.0) |
| Descrição | String | Orientação sobre quando usar |

**Passos:**
1. No painel Admin, vá em **Categorias**
2. Clique em **"+ Nova Categoria"**
3. Preencha os campos
4. Clique em **"Salvar"**

---

## Editar categoria existente

Clique no ícone de lápis (✏️) na linha da categoria. Você pode editar:
- Nome
- Ícone
- Peso
- Descrição

:::warning Impacto da mudança de peso
Alterar o peso de uma categoria **afeta retroativamente** o cálculo do ranking? **Não.** O peso é aplicado apenas em novos kudos após a mudança. Kudos antigos mantêm a pontuação original calculada na criação.
:::

---

## Ativar / Desativar categoria

Categorias desativadas:
- Não aparecem no formulário de criação de kudos
- Kudos já criados com essa categoria permanecem intactos
- Podem ser reativadas a qualquer momento

---

## Quando usar pesos diferentes?

| Peso | Quando usar |
|------|------------|
| `1.0` | Comportamentos base, frequentes |
| `1.2` | Comportamentos com impacto mensurável |
| `1.5` | Comportamentos estratégicos ou diferenciados |
| `2.0` | Categorias especiais de campanhas (uso temporário) |

:::tip Boas práticas de peso
Evite pesos muito altos (>2.0) — eles distorcem o ranking. Se quiser destacar um comportamento temporariamente, crie uma categoria especial com duração definida e desative depois.
:::

---

## Endpoint (API)

```
GET    /departments              Lista categorias
POST   /admin/categories         Cria categoria
PATCH  /admin/categories/:id     Edita categoria
PATCH  /admin/categories/:id/toggle  Ativa/desativa
```
