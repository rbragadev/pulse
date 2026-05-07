import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

const features = [
  {
    icon: '🚀',
    title: 'Kudos em tempo real',
    desc: 'Envie reconhecimentos instantâneos para qualquer colega, com categorias, hashtags e mensagens personalizadas.',
  },
  {
    icon: '🏆',
    title: 'Rankings & Temporadas',
    desc: 'Sistema de ranking mensal com reset automático. Os Galácticos do mês ganham destaque e troféus.',
  },
  {
    icon: '🏅',
    title: 'Badges & Conquistas',
    desc: '8 badges com raridades (Comum → Lendário) e conquistas desbloqueáveis por comportamentos reais.',
  },
  {
    icon: '🧑‍💼',
    title: 'Perfil Social',
    desc: 'Cada colaborador tem um perfil com reputação, conquistas, badges, ranking e histórico de kudos.',
  },
  {
    icon: '💬',
    title: 'Feed Social',
    desc: 'Reações (🔥🚀❤️👏🧠), comentários, likes — engajamento genuíno em cada reconhecimento.',
  },
  {
    icon: '🛡️',
    title: 'Painel Admin',
    desc: 'Dashboard completo para People e Admins: analytics, moderação, gestão de usuários e categorias.',
  },
  {
    icon: '🔐',
    title: 'Auth Google',
    desc: 'Login exclusivo com conta corporativa @grupootg.com via OAuth 2.0. Seguro e sem senhas extras.',
  },
  {
    icon: '📊',
    title: 'Analytics de Engajamento',
    desc: 'Métricas de reconhecimento por departamento, tendências semanais e participação da equipe.',
  },
];

const audiences = [
  {
    icon: '👩‍💼',
    title: 'Time de People',
    desc: 'Guias de moderação, analytics e gestão de cultura',
  },
  {
    icon: '🛡️',
    title: 'Admins',
    desc: 'Controle total da plataforma, regras e usuários',
  },
  {
    icon: '👨‍💻',
    title: 'Desenvolvedores',
    desc: 'Arquitetura, setup local e guia de contribuição',
  },
  {
    icon: '🤝',
    title: 'Colaboradores',
    desc: 'Como usar a plataforma e aproveitar ao máximo',
  },
  {
    icon: '📈',
    title: 'Liderança',
    desc: 'Visão de engajamento, ranking e cultura',
  },
];

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Central de conhecimento da plataforma Pulse — reconhecimento e cultura OTG"
    >
      {/* Hero */}
      <div className="hero-pulse">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
        <h1 className="hero-pulse__title">Pulse Docs</h1>
        <p className="hero-pulse__subtitle">
          Central de conhecimento completa da plataforma de reconhecimento do Grupo OTG.
          Tudo o que você precisa saber — em um só lugar.
        </p>

        <div className="hero-pulse__badges">
          <span className="badge-pill">v1.0</span>
          <span className="badge-pill">🌙 Dark Mode</span>
          <span className="badge-pill">🔍 Busca integrada</span>
          <span className="badge-pill">🇧🇷 Português</span>
          <span className="badge-pill">NestJS + React</span>
        </div>

        <div className="hero-pulse__buttons">
          <Link className="btn-primary-pulse" to="/intro">
            📖 Ler Documentação
          </Link>
          <Link className="btn-secondary-pulse" to="/fluxo-colaborador/visao-geral">
            🧭 Guia do Colaborador
          </Link>
          <Link className="btn-secondary-pulse" to="/guia-admin/visao-geral">
            🛡️ Guia Admin
          </Link>
        </div>
      </div>

      {/* Features */}
      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="section-label">Funcionalidades</p>
          <h2 className="section-title">Tudo para uma cultura de reconhecimento</h2>
          <p className="section-desc">
            O Pulse foi construído para ser a plataforma social interna da OTG —
            com engajamento real, gamificação significativa e dados acionáveis.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-card__icon">{f.icon}</span>
              <div className="feature-card__title">{f.title}</div>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audience */}
      <section className="audience-section">
        <div className="audience-section__inner">
          <p className="section-label">Para quem é esta documentação</p>
          <h2 className="section-title">Uma central para todos</h2>
          <p className="section-desc">
            A documentação do Pulse foi desenhada para atender diferentes perfis,
            do colaborador que está usando pela primeira vez ao desenvolvedor que vai evoluir a plataforma.
          </p>
          <div className="audience-grid">
            {audiences.map((a) => (
              <div key={a.title} className="audience-card">
                <span className="audience-card__icon">{a.icon}</span>
                <div className="audience-card__title">{a.title}</div>
                <p className="audience-card__desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
