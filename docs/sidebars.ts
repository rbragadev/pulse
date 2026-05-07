import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '👋 Introdução',
    },
    {
      type: 'category',
      label: '📘 Conceitos Principais',
      collapsed: false,
      items: [
        'conceitos/kudos',
        'conceitos/galacticos',
        'conceitos/temporadas',
        'conceitos/badges',
        'conceitos/conquistas',
        'conceitos/ranking',
        'conceitos/reputacao-social',
      ],
    },
    {
      type: 'category',
      label: '🧭 Fluxo do Colaborador',
      items: [
        'fluxo-colaborador/visao-geral',
        'fluxo-colaborador/login',
        'fluxo-colaborador/criando-kudos',
        'fluxo-colaborador/interacoes',
        'fluxo-colaborador/perfil-e-conquistas',
      ],
    },
    {
      type: 'category',
      label: '🖥️ Telas da Plataforma',
      items: [
        'telas/login',
        'telas/feed',
        'telas/perfil',
        'telas/galacticos',
        'telas/hall-da-fama',
        'telas/badges',
        'telas/comunidades',
        'telas/admin',
      ],
    },
    {
      type: 'category',
      label: '⚙️ Regras de Negócio',
      items: [
        'regras-de-negocio/kudos',
        'regras-de-negocio/ranking',
        'regras-de-negocio/reputacao-social',
        'regras-de-negocio/badges',
        'regras-de-negocio/conquistas',
      ],
    },
    {
      type: 'category',
      label: '🛡️ Guia People / Admin',
      items: [
        'guia-admin/visao-geral',
        'guia-admin/gestao-usuarios',
        'guia-admin/gestao-categorias',
        'guia-admin/moderacao',
        'guia-admin/analytics',
      ],
    },
    {
      type: 'category',
      label: '🛠️ Desenvolvimento',
      items: [
        'desenvolvimento/configuracao-local',
        'desenvolvimento/arquitetura',
        'desenvolvimento/seeds',
      ],
    },
    {
      type: 'doc',
      id: 'roadmap',
      label: '🚀 Roadmap',
    },
  ],
};

export default sidebars;
