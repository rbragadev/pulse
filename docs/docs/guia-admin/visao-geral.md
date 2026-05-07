---
id: visao-geral
title: Visão Geral do Admin
sidebar_position: 1
---

# 🛡️ Guia People / Admin — Visão Geral

Este manual foi criado para o time de People e Admins da OTG que gerenciam a plataforma Pulse no dia a dia.

---

## Quem é o Admin do Pulse?

O **Admin** é um colaborador com permissão especial na plataforma, responsável por:

- Garantir que a plataforma funcione corretamente
- Moderar conteúdo inadequado
- Gerenciar usuários, departamentos e categorias
- Analisar dados de engajamento
- Apoiar o time de People com relatórios

---

## Como se tornar Admin?

Apenas um Admin existente pode conceder a role de admin para outro usuário. Para o primeiro admin, é necessário acesso direto ao banco de dados ou via seed.

```sql
-- Tornar um usuário admin via banco de dados
UPDATE "User" SET role = 'ADMIN' WHERE email = 'seu.email@grupootg.com';
```

---

## Responsabilidades do Admin por área

| Área | Responsabilidade | Frequência |
|------|----------------|-----------|
| Usuários | Ativar novos colaboradores, ajustar departamentos | Semanal |
| Moderação | Revisar conteúdo reportado, ocultar impróprios | Conforme demanda |
| Categorias | Ajustar pesos, criar categorias especiais | Mensal |
| Analytics | Revisar engajamento, gerar relatórios | Semanal |
| Temporadas | Encerrar temporada, declarar campeão | Mensal |
| Badges | Atribuir badges merecidas | Conforme avaliação |

---

## Checklist semanal do Admin

```
□ Verificar novos usuários cadastrados
□ Revisar kudos da semana (qualidade de mensagens)
□ Checar se há conteúdo para moderar
□ Analisar engajamento semanal no dashboard
□ Conferir ranking da temporada atual
□ Atribuir badges pendentes
```

---

## Acesso ao painel Admin

1. Faça login com sua conta @grupootg.com
2. No menu lateral, clique em **"Admin"** (visível apenas para admins)
3. Ou acesse diretamente: `https://pulse.grupootg.com/admin`

:::warning Segurança
Nunca compartilhe credenciais de admin. Cada admin deve ter seu próprio login. Em caso de desligamento de um admin, desative imediatamente a conta.
:::
