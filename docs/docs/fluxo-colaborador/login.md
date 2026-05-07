---
id: login
title: Login e Primeiro Acesso
sidebar_position: 2
---

# 🔐 Login e Primeiro Acesso

O Pulse utiliza **autenticação exclusiva via Google OAuth 2.0** com a conta corporativa da OTG. Não há senhas separadas a memorizar.

---

## Requisitos de acesso

:::warning Acesso restrito
Apenas contas com domínio **@grupootg.com** têm acesso ao Pulse.
Tentativas com contas Gmail pessoais ou outros domínios são bloqueadas automaticamente.
:::

---

## Passo a passo do primeiro acesso

**1.** Acesse o Pulse em `https://pulse.grupootg.com` (ou `localhost:5173` localmente)

**2.** Clique em **"Entrar com Google"**

**3.** O Google abre um popup de autenticação — selecione sua conta @grupootg.com

**4.** Autorize o Pulse a acessar suas informações básicas de perfil

**5.** Você é redirecionado automaticamente para o Feed

---

## O que acontece no primeiro login?

Na primeira autenticação, o sistema:
1. Cria automaticamente seu perfil no Pulse
2. Importa seu nome, e-mail e foto de perfil do Google
3. Define seu status inicial como colaborador ativo
4. Atribui seu departamento (ou fica sem departamento até um admin configurar)

---

## Sessão e logout

- A sessão é mantida via **JWT** com validade de 7 dias
- O token é renovado automaticamente a cada acesso
- Para sair, clique no avatar no canto superior direito (se implementado) ou limpe os cookies do navegador

---

## Problemas comuns

| Problema | Causa provável | Solução |
|---------|---------------|---------|
| "Acesso negado" | Conta não é @grupootg.com | Use a conta corporativa |
| Popup bloqueado | Bloqueador de popups ativo | Permita popups para o domínio |
| Loop de login | Token corrompido | Limpe cookies e tente novamente |
| Foto não aparece | Google sem foto definida | Adicione foto no Google Workspace |

:::info Suporte
Em caso de problemas de acesso, contate o time de TI ou o admin do Pulse.
:::
