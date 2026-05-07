---
id: gestao-usuarios
title: Gestão de Usuários
sidebar_position: 2
---

# 👥 Gestão de Usuários

---

## Onde encontrar

**Admin** → **Usuários** (aba lateral no painel admin)

---

## Lista de usuários

A lista exibe todos os colaboradores cadastrados com:

| Coluna | Descrição |
|--------|-----------|
| Nome | Nome completo do colaborador |
| E-mail | Endereço @grupootg.com |
| Departamento | Setor atual |
| Role | USER ou ADMIN |
| Status | Ativo / Inativo |
| Ações | Ver perfil, Ativar/Desativar, Alterar role |

---

## Ativar / Desativar usuário

:::warning Impacto de desativação
Ao **desativar** um usuário:
- O usuário perde acesso à plataforma imediatamente
- Kudos enviados e recebidos permanecem no feed (histórico preservado)
- Pontos no ranking são mantidos (não são removidos)
- Não é possível enviar novo kudos para o usuário desativado
:::

**Para ativar ou desativar:**
1. Na lista de usuários, clique em "..." no usuário
2. Selecione "Ativar" ou "Desativar"
3. Confirme a ação no modal

---

## Alterar role (USER ↔ ADMIN)

**Para promover um usuário a Admin:**
1. Na lista, clique em "..." no usuário
2. Selecione "Tornar Admin"
3. Confirme a ação

**Para rebaixar um Admin para User:**
1. Na lista, clique em "..." no admin
2. Selecione "Remover Admin"
3. Confirme

:::danger Cuidado com essa ação
Promover alguém a Admin dá acesso total à plataforma, incluindo moderação e dados de todos os usuários. Faça isso apenas para pessoas de confiança do time de People ou TI.
:::

---

## Alterar departamento

No V1, o departamento é definido na criação do usuário. Para alterá-lo:

**Via painel admin (futuro):** Em breve na próxima versão.

**Via banco de dados (atual):**
```sql
UPDATE "User" 
SET "departmentId" = 'ID_DO_DEPARTAMENTO'
WHERE email = 'colaborador@grupootg.com';
```

---

## Usuários de teste (ambiente de desenvolvimento)

| Nome | E-mail | Role |
|------|--------|------|
| Raphael Braga | raphaelbraga@grupootg.com | ADMIN |
| Lucas Ferreira | lucasferreira@grupootg.com | USER |
| Ana Costa | anacosta@grupootg.com | USER |
| Carlos Mendes | carlosmendes@grupootg.com | USER |
| Fernanda Lima | fernandalima@grupootg.com | USER |

Ver todos os usuários do seed em [Seeds e Ambiente Local](/desenvolvimento/seeds).

---

## Endpoint de usuários (API)

```
GET    /admin/users              Lista todos os usuários
PATCH  /admin/users/:id/toggle   Ativar/Desativar
PATCH  /admin/users/:id/role     Alterar role
```
