---
id: feed
title: Tela de Feed
sidebar_position: 2
---

# 📰 Tela de Feed

O Feed é o **coração social** do Pulse — onde todos os reconhecimentos aparecem em tempo real, criando uma linha do tempo viva da cultura OTG.

---

## Layout geral

A tela usa um layout de **2 colunas** (em desktop):

```
┌──────────────────────────────────────────────────────┐
│ SIDEBAR │              FEED                 │ WIDGETS │
│         │ ┌─────────────────────────────┐   │         │
│  Feed   │ │ 🚀 Feed Composer            │   │ ⚡ Ranking│
│  Galác  │ └─────────────────────────────┘   │ Ao Vivo │
│  Hall   │                                   │         │
│  Badges │ ┌─────────────────────────────┐   │ 👥 Comu- │
│  Comu.  │ │ [KudosCard]                 │   │ nidades │
│  Perfil │ │ [KudosCard]                 │   │         │
│         │ │ [KudosCard]                 │   │ 🎂 Aniver│
│         │ │ ...                         │   │ -sários │
│         │ └─────────────────────────────┘   │         │
│         │                                   │ 📅 Eventos│
└──────────────────────────────────────────────────────┘
```

---

## Feed Composer

O compositor no topo do feed é um CTA visual para enviar reconhecimentos:

- Exibe o **avatar** do usuário logado (linkado para o perfil)
- Campo clicável com texto _"Reconheça alguém hoje 🚀"_
- Botão **"Reconhecer ⚡"** que abre o diálogo de criação de kudos

---

## KudosCard

Cada reconhecimento é exibido como um card com:

| Elemento | Descrição |
|---------|-----------|
| Avatar do autor | Foto + nome de quem enviou |
| Destinatário | Nome + avatar de quem recebeu |
| Badge de categoria | Ícone + nome da categoria do kudos |
| Mensagem | Texto completo do reconhecimento |
| Data relativa | "há 2h", "há 3 dias", etc. |
| ❤️ Likes | Contador + botão de like |
| 🔥🚀❤️👏🧠 Reações | Picker de 5 reações |
| 💬 Comentários | Expandir/recolher + campo de resposta |

---

## Widgets da Sidebar

A sidebar direita (visível apenas em `lg:` screens) exibe:

### ⚡ Ranking Ao Vivo
Top 5 da temporada ativa com posição, nome e pontos. Link para a tela completa de Galácticos. Badge verde "Ao Vivo".

### 👥 Comunidades
Preview das comunidades disponíveis (preview — em breve). Cards com nome, membros e posts.

### 🎂 Aniversários
Lista de aniversários da semana com indicação "Hoje 🎂", "Amanhã", etc.

### 📅 Próximos Eventos
Eventos corporativos próximos com data e nome.

---

## Paginação

O feed carrega **20 kudos por vez**. No final da lista, um botão "Carregar mais" busca o próximo lote. O total de reconhecimentos publicados é exibido no cabeçalho.

---

## Estado vazio

Se não há nenhum kudos publicado ainda, o feed exibe um estado vazio com:
- Ícone ilustrativo
- Texto motivacional
- Botão direto para enviar o primeiro kudos
