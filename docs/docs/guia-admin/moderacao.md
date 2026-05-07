---
id: moderacao
title: Moderação de Conteúdo
sidebar_position: 4
---

# 🚨 Moderação de Conteúdo

O Pulse é uma plataforma pública internamente. O time de People é responsável por garantir que o conteúdo seja respeitoso, autêntico e alinhado à cultura OTG.

---

## Princípios de moderação

:::info Moderação leve
O Pulse adota uma abordagem de moderação **leve e cultural**. O objetivo não é censurar, mas garantir que o reconhecimento seja genuíno e respeitoso. A maioria dos kudos nunca precisará de intervenção.
:::

---

## O que pode ser moderado?

| Tipo | Ação recomendada |
|------|----------------|
| Mensagem ofensiva, desrespeitosa | Ocultar imediatamente |
| Mensagem vaga ou sem substância | Conversa com o autor |
| Kudos claramente não-genuíno | Ocultar + conversa |
| Uso para fins não-relacionados ao trabalho | Avaliar contexto |
| Spam de kudos (mesmo conteúdo repetido) | Ocultar + avisar |

---

## Ocultar um Kudos

Ocultar **não exclui** o kudos — ele fica arquivado no banco de dados e pode ser restaurado.

**Passos:**
1. No Admin → **Kudos**
2. Encontre o kudos usando filtros (data, usuário, palavra-chave)
3. Clique em **"Ocultar"**
4. Confirme a ação

Após ocultar:
- O kudos desaparece do feed público
- Os pontos gerados por ele **permanecem** (para não punir o destinatário)
- O autor não é notificado automaticamente (o admin deve fazer isso manualmente)

---

## Restaurar um Kudos oculto

**Passos:**
1. Admin → **Kudos** → Filtrar por "Ocultos"
2. Encontre o kudos
3. Clique em **"Restaurar"**

O kudos volta ao feed imediatamente.

---

## Fluxo de moderação recomendado

```
Identificado conteúdo problemático
           ↓
Admin oculta o kudos (segurança imediata)
           ↓
Admin avalia contexto (intenção do autor)
           ↓
  ┌────────────────────────────────┐
  │ Erro genuíno / intenção boa   │
  │ → Conversa + pode restaurar  │
  └────────────────────────────────┘
           OU
  ┌────────────────────────────────┐
  │ Comportamento inadequado      │
  │ → Manter oculto + feedback    │
  └────────────────────────────────┘
```

---

## Pontos e moderação

:::warning Pontos não são removidos
Quando um kudos é ocultado, os **pontos já computados no ranking não são removidos automaticamente**. Isso evita punir o destinatário por algo fora do seu controle.

Se necessário retirar os pontos, entre em contato com o time de desenvolvimento.
:::

---

## Comentários inadequados

Para remover comentários inadequados, é necessário acesso direto ao banco de dados no V1:

```sql
DELETE FROM "KudosComment" WHERE id = 'ID_DO_COMENTARIO';
```

Na V2, haverá interface de moderação de comentários no painel admin.

---

## Boas práticas para People

1. **Nunca modere impulsivamente** — sempre leia o contexto completo
2. **Documente moderações** — mantenha log das ações em planilha interna
3. **Comunique ao autor** — explique o porquê da moderação (por Slack/e-mail)
4. **Use como oportunidade de educação** — uma moderação bem feita melhora a cultura
5. **Revise mensalmente** — os kudos ocultos para decidir se mantém ou restaura
