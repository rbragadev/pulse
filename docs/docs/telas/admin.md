---
id: admin
title: Tela Admin
sidebar_position: 8
---

# 🛡️ Tela Admin

O painel administrativo é exclusivo para usuários com a role **ADMIN** no Pulse. É onde o time de People gerencia toda a plataforma.

---

## Acesso

:::warning Acesso restrito
A tela Admin só é acessível por usuários com role `ADMIN`. Tentar acessar `/admin` sem permissão resulta em redirecionamento.
:::

O link para o Admin aparece no menu lateral **apenas para admins**. Rota: `/admin`

---

## Dashboard — Visão Geral

A tela principal do admin exibe métricas de saúde da plataforma:

| Métrica | O que mede |
|---------|-----------|
| Total de usuários | Colaboradores cadastrados na plataforma |
| Kudos este mês | Reconhecimentos publicados no mês atual |
| Usuários ativos | Colaboradores com ação nos últimos 30 dias |
| Total de likes | Todas as curtidas registradas |

---

## Subseções do Admin

### 👥 Usuários
Lista paginada de todos os colaboradores com:
- Nome, e-mail, departamento, role, status (ativo/inativo)
- Ações: **Ativar/Desativar**, **Alterar role** (USER ↔ ADMIN), **Ver perfil**

### 🏷️ Categorias
Gestão das categorias de kudos:
- Criar nova categoria (nome, ícone, cor, peso)
- Editar peso e ícone
- Ativar/desativar categorias

### 📋 Kudos (Moderação)
Lista de todos os kudos com:
- Filtro por status, data, usuário
- Ação de **ocultar/restaurar** conteúdo
- Visualização completa do card

### 📊 Analytics
Dashboard de engajamento:
- Gráfico de kudos por semana
- Ranking de participação por departamento
- Usuários mais ativos vs. menos ativos
- Taxa de engajamento (interações/kudos)

---

## Permissões do Admin vs. User

| Ação | User | Admin |
|------|------|-------|
| Enviar kudos | ✅ | ✅ |
| Ver feed | ✅ | ✅ |
| Ver perfis | ✅ | ✅ |
| Ocultar kudos | ❌ | ✅ |
| Criar categorias | ❌ | ✅ |
| Desativar usuários | ❌ | ✅ |
| Ver analytics | ❌ | ✅ |
| Atribuir badges | ❌ | ✅ |
| Gerenciar temporadas | ❌ | ✅ |

---

## Guia completo

Para um guia detalhado de cada função administrativa, veja a seção [Guia People / Admin](/guia-admin/visao-geral).
