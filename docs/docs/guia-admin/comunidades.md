---
id: comunidades
title: Gerenciando Comunidades
sidebar_position: 6
---

# 👥 Gerenciando Comunidades

O Admin tem controle total sobre o status, visibilidade e qualificação de todas as comunidades da plataforma, acessível em **Admin → Comunidades**.

---

## Visão geral da tela

A tabela de comunidades exibe:

| Coluna | Descrição |
|--------|-----------|
| Nome + slug | Identidade da comunidade |
| Membros | Contagem atual |
| Criador | Quem criou e quando |
| Status | `ACTIVE`, `INACTIVE` ou `ARCHIVED` |
| Oficial | Toggle de comunidade oficial |

---

## Alterando o status de uma comunidade

1. Acesse **Admin → Comunidades**
2. Na linha da comunidade desejada, clique no seletor de **Status**
3. Escolha o novo status
4. A mudança é salva automaticamente (sem botão de confirmar)

### O que cada status faz

| Status | Efeito |
|--------|--------|
| `ACTIVE` | Comunidade visível e operacional |
| `INACTIVE` | Comunidade visível mas sem novas interações (posts/comentários bloqueados) |
| `ARCHIVED` | Comunidade oculta da listagem pública |

:::warning Uso do ARCHIVED
Use `ARCHIVED` para comunidades encerradas ou criadas por engano. Usuários não as veem mais, mas os dados são preservados no banco.
:::

---

## Marcando uma comunidade como Oficial

Comunidades oficiais recebem uma badge especial na listagem e sinalizam que são endossadas pela empresa (ex: grupos de departamento, comunidades de cultura OTG).

1. Na tabela, localize a comunidade
2. Clique no ícone de estrela (⭐) na coluna "Oficial"
3. A badge aparece imediatamente no card da comunidade

:::tip Critérios sugeridos para Oficial
- Criada ou aprovada pelo time de People / Liderança
- Voltada para toda a empresa ou um departamento específico
- Tem moderador ativo designado
:::

---

## Moderação de posts

No V1, a moderação de posts de comunidade é feita pelos próprios Owners e Moderadores da comunidade. O Admin não tem uma tela dedicada de posts de comunidade (disponível na V2).

Se necessário intervir diretamente em um post problemático, entre em contato com o Owner da comunidade ou acesse o banco de dados.

---

## Promovendo membros a Moderador

No V1, a promoção de membros a `MODERATOR` não está disponível na UI. Para promover um membro:

```sql
UPDATE "CommunityMember"
SET role = 'MODERATOR'
WHERE "communityId" = '<ID>' AND "userId" = '<ID>';
```

:::info Planejado para V2
A interface de gerenciamento de membros (promover/rebaixar) está no roadmap da V2.
:::

---

## Transferindo a liderança (OWNER)

Se um OWNER sair da empresa ou solicitar saída, é necessário transferir o ownership antes de desativar sua conta:

```sql
-- Promover outro membro a OWNER
UPDATE "CommunityMember"
SET role = 'OWNER'
WHERE "communityId" = '<ID>' AND "userId" = '<NOVO_OWNER_ID>';

-- Rebaixar o owner anterior (opcional, ou apenas desativar o user)
UPDATE "CommunityMember"
SET role = 'MEMBER'
WHERE "communityId" = '<ID>' AND "userId" = '<OWNER_ANTERIOR_ID>';
```

Após isso, desativar o usuário via **Admin → Usuários**.

---

## Boas práticas

1. **Revisar comunidades inativas mensalmente** — arquive as que não têm atividade há 60+ dias
2. **Definir critérios claros para Oficial** — evite inflacionar o badge
3. **Comunicar ao Owner** antes de arquivar uma comunidade ativa
4. **Não delete dados** — prefira `ARCHIVED` a exclusão; o histórico é valioso
