---
id: perfil
title: Tela de Perfil
sidebar_position: 3
---

# 👤 Tela de Perfil

A tela de perfil é o **cartão de visitas social** de cada colaborador. É uma das telas mais ricas do Pulse — inspirada nos perfis do Orkut e no estilo de plataformas modernas como LinkedIn e GitHub.

---

## Layout

```
┌────────────────────────────────────────────────┐
│           [Cover gradient]                     │
│  ┌───┐  Nome do Colaborador                    │
│  │ 👤│  Cargo · Departamento                   │
│  └───┘  📊 X kudos · X enviados · X likes     │
│                                                │
│  🛡️ Confiável [████████░░] 47    [Votar]       │
│  😊 Legal      [██████████] 62                 │
│  💼 Profissional [███████░░] 38                │
│                                                │
│  🏅 Badges      🎯 Conquistas                  │
│  [badge][badge] [conquista][conquista]...      │
│                                                │
│  📋 Últimos reconhecimentos recebidos          │
│  [KudosCard mini] [KudosCard mini]...          │
└────────────────────────────────────────────────┘
```

---

## Seções do perfil

### Cabeçalho do perfil

| Elemento | Descrição |
|---------|-----------|
| Avatar | Foto importada do Google Workspace |
| Nome | Nome completo |
| Cargo | Configurado pelo admin |
| Departamento | Setor do colaborador |
| Estatísticas | Kudos recebidos, enviados, likes, posição no ranking |

### Reputação Social

Três dimensões votáveis por qualquer colega:

```
🛡️ Confiável     ████████░░  47 votos
😊 Legal          ██████████  62 votos
💼 Profissional  ███████░░░  38 votos
```

O visitante pode votar nas 3 dimensões (1 voto por dimensão por pessoa).

### Badges

Grade horizontal com as badges conquistadas pelo colaborador. Ao passar o mouse, exibe o nome e a descrição da badge. Badges são ordenadas por raridade (mais raras primeiro).

### Conquistas

Timeline cronológica de conquistas desbloqueadas. Cada item exibe:
- Ícone da conquista
- Nome e descrição
- Data de desbloqueio

Conquistas não desbloqueadas aparecem em cinza com cadeado 🔒.

### Histórico de Kudos recebidos

Cards compactos dos últimos kudos recebidos, com:
- Quem enviou
- Mensagem resumida
- Categoria
- Data

---

## Perfil próprio vs. perfil de outro

| Elemento | Meu perfil | Perfil de colega |
|---------|-----------|----------------|
| Ver tudo | ✅ | ✅ |
| Votar na reputação | ❌ (não pode votar em si mesmo) | ✅ |
| Botão "Reconhecer" | ❌ | ✅ |
| Editar informações | ❌ (via admin) | ❌ |

---

## Rota do perfil

- **Meu perfil:** `/profile`
- **Perfil de outro colaborador:** `/profile/:userId`

Todos os links em kudos, galácticos e no ranking apontam para o perfil com o ID correto do usuário.
