---
id: seeds
title: Seeds e Dados de Teste
sidebar_position: 3
---

# 🌱 Seeds e Dados de Teste

O seed do Pulse popula o banco de dados com dados realistas para desenvolvimento e demonstração da plataforma.

---

## Como executar o seed

```bash
cd backend

# Rodar apenas o seed (banco já migrado)
npx ts-node prisma/seed.ts

# Resetar banco E rodar seed do zero
npx prisma migrate reset
npx ts-node prisma/seed.ts
```

---

## O que o seed cria?

### Departamentos (6)

| Departamento |
|-------------|
| Engenharia |
| Produto |
| Marketing |
| Comercial |
| People & RH |
| Design |

---

### Categorias de Kudos (6)

| Categoria | Ícone | Peso |
|-----------|-------|------|
| Trabalho em Equipe | 🤝 | 1.0 |
| Inovação | 💡 | 1.5 |
| Liderança | 👑 | 1.5 |
| Resultado | 📊 | 1.2 |
| Cliente | 🎯 | 1.3 |
| Cultura | 🌟 | 1.0 |

---

### Usuários de Teste (20+)

| Nome | E-mail | Departamento | Role |
|------|--------|-------------|------|
| Raphael Braga | raphaelbraga@grupootg.com | Engenharia | **ADMIN** |
| Lucas Ferreira | lucasferreira@grupootg.com | Engenharia | USER |
| Ana Costa | anacosta@grupootg.com | Produto | USER |
| Carlos Mendes | carlosmendes@grupootg.com | Engenharia | USER |
| Fernanda Lima | fernandalima@grupootg.com | Marketing | USER |
| Pedro Alves | pedroalves@grupootg.com | Comercial | USER |
| Camila Santos | camilasantos@grupootg.com | People & RH | USER |
| Mateus Oliveira | mateusoliveira@grupootg.com | Engenharia | USER |
| Gabriel Silva | gabrielsilva@grupootg.com | Engenharia | USER |
| Larissa Rocha | larissarocha@grupootg.com | Design | USER |
| Mariana Souza | marianasouza@grupootg.com | Produto | USER |
| Gustavo Pereira | gustavopereira@grupootg.com | Engenharia | USER |
| Isabela Martins | isabelamartins@grupootg.com | People & RH | USER |
| Thiago Nascimento | thiagonascimento@grupootg.com | Comercial | USER |
| Juliana Ferreira | julianaferreira@grupootg.com | Marketing | USER |
| Felipe Costa | felipecosta@grupootg.com | Comercial | USER |
| Amanda Ribeiro | amandaribeiro@grupootg.com | Design | USER |
| Rodrigo Almeida | rodrigoalmeida@grupootg.com | Engenharia | USER |
| Patricia Lima | patricialima@grupootg.com | Produto | USER |
| Beatriz Cardoso | beatrizcardoso@grupootg.com | People & RH | USER |

---

### Kudos (52)

52 kudos com mensagens realistas distribuídas ao longo dos últimos 57 dias, cobrindo todas as categorias e usuários.

---

### Curtidas (318)

Distribuídas aleatoriamente por todos os 52 kudos, com mais likes nos posts mais antigos.

---

### Reações (356)

Todos os 5 tipos de reação distribuídos por todos os 52 kudos. Posts recentes têm reações extras.

---

### Comentários (29)

30 comentários distribuídos nos principais kudos, com mensagens de apoio e contexto adicional.

---

### Badges (8)

As 8 badges descritas em [Badges](/regras-de-negocio/badges), atribuídas a vários colaboradores.

---

### Conquistas (8)

As 8 conquistas descritas em [Conquistas](/regras-de-negocio/conquistas), atribuídas automaticamente com base nos dados gerados.

---

### Temporadas (3)

| Temporada | Período | Status |
|-----------|---------|--------|
| Temporada Março 2026 | 01/03 – 31/03 | Encerrada |
| Temporada Abril 2026 | 01/04 – 30/04 | Encerrada |
| Temporada Maio 2026 | 01/05 – 31/05 | **Ativa** |

---

### Votos de Reputação (23)

Pares de votos nas 3 dimensões (Confiável, Legal, Profissional) distribuídos entre colaboradores.

---

### Visitas de Perfil (13)

Visitas registradas entre diferentes colaboradores para popular o histórico de perfil.

---

## Credenciais de Admin

```
E-mail: raphaelbraga@grupootg.com
Role: ADMIN
```

:::info Login local
Para logar localmente você precisará configurar o Google OAuth com sua conta real. O e-mail do seed (`raphaelbraga@grupootg.com`) é um e-mail de referência. Na prática, qualquer conta `@grupootg.com` autenticada pelo Google pode ter a role promovida para ADMIN via SQL.
:::

---

## Adicionando dados manualmente

Após subir o projeto, você pode criar dados adicionais via:

1. **Interface da plataforma** — Login e criar kudos normalmente
2. **Prisma Studio** — GUI visual para editar diretamente:
   ```bash
   cd backend && npx prisma studio
   ```
3. **Seed personalizado** — Editar `backend/prisma/seed.ts` e rodar novamente
