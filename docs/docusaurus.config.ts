import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Pulse — Docs',
  tagline: 'Central de conhecimento da plataforma de reconhecimento OTG',
  favicon: 'img/pulse-logo.svg',

  url: 'https://pulse.grupootg.com',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['pt'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/',
        indexBlog: false,
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    image: 'img/pulse-og.png',

    navbar: {
      title: 'Pulse',
      logo: {
        alt: 'Pulse Logo',
        src: 'img/pulse-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Documentação',
        },
        {
          href: 'http://localhost:5173',
          label: 'Abrir Pulse',
          position: 'right',
        },
        {
          href: 'https://github.com/rbragadev/pulse',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Plataforma',
          items: [
            { label: 'Feed', to: '/telas/feed' },
            { label: 'Galácticos', to: '/telas/galacticos' },
            { label: 'Hall da Fama', to: '/telas/hall-da-fama' },
            { label: 'Admin', to: '/telas/admin' },
          ],
        },
        {
          title: 'Guias',
          items: [
            { label: 'Para Colaboradores', to: '/fluxo-colaborador/visao-geral' },
            { label: 'Para People/Admin', to: '/guia-admin/visao-geral' },
            { label: 'Regras de Negócio', to: '/regras-de-negocio/kudos' },
          ],
        },
        {
          title: 'Técnico',
          items: [
            { label: 'Setup Local', to: '/desenvolvimento/configuracao-local' },
            { label: 'Arquitetura', to: '/desenvolvimento/arquitetura' },
            { label: 'Roadmap', to: '/roadmap' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} OTG — Grupo OTG. Todos os direitos reservados.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'sql'],
    },

    metadata: [
      {
        name: 'description',
        content: 'Documentação interna completa da plataforma Pulse — reconhecimento e cultura OTG.',
      },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
