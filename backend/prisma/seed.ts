import { PrismaClient, Role, BadgeRarity, ReactionType, VoteType } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), 0, 0);
  return d;
}

async function main() {
  console.log('🌱 Iniciando seed completo...');

  await prisma.profileVisit.deleteMany();
  await prisma.profileVote.deleteMany();
  await prisma.kudosComment.deleteMany();
  await prisma.kudosReaction.deleteMany();
  await prisma.kudosLike.deleteMany();
  await prisma.kudosPost.deleteMany();
  await prisma.pointRule.deleteMany();
  await prisma.kudosCategory.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.seasonRanking.deleteMany();
  await prisma.season.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  // ─── Departments ─────────────────────────────────────────────────────────
  const [tech, produto, people, marketing, financeiro, comercial] = await Promise.all([
    prisma.department.create({ data: { name: 'Tecnologia', color: '#6366f1' } }),
    prisma.department.create({ data: { name: 'Produto', color: '#8b5cf6' } }),
    prisma.department.create({ data: { name: 'People', color: '#ec4899' } }),
    prisma.department.create({ data: { name: 'Marketing', color: '#f59e0b' } }),
    prisma.department.create({ data: { name: 'Financeiro', color: '#10b981' } }),
    prisma.department.create({ data: { name: 'Comercial', color: '#3b82f6' } }),
  ]);
  console.log('✅ Departamentos criados.');

  // ─── Categories ──────────────────────────────────────────────────────────
  const [trabalho, lideranca, cultura, inovacao, ajuda, cliente] = await Promise.all([
    prisma.kudosCategory.create({
      data: { name: 'Trabalho em Equipe', description: 'Colaboração e parceria', icon: '🤝', color: '#22c55e', weight: 1 },
    }),
    prisma.kudosCategory.create({
      data: { name: 'Liderança', description: 'Inspirar e guiar pessoas', icon: '⭐', color: '#f59e0b', weight: 3 },
    }),
    prisma.kudosCategory.create({
      data: { name: 'Cultura OTG', description: 'Viver os valores da empresa', icon: '🏆', color: '#ec4899', weight: 2 },
    }),
    prisma.kudosCategory.create({
      data: { name: 'Inovação', description: 'Novas ideias e soluções criativas', icon: '🚀', color: '#6366f1', weight: 2 },
    }),
    prisma.kudosCategory.create({
      data: { name: 'Ajuda ao Colega', description: 'Suporte e generosidade', icon: '💙', color: '#3b82f6', weight: 1 },
    }),
    prisma.kudosCategory.create({
      data: { name: 'Cliente em Primeiro', description: 'Foco total na experiência do cliente', icon: '💎', color: '#14b8a6', weight: 2 },
    }),
  ]);
  console.log('✅ Categorias criadas.');

  // ─── Point Rules ─────────────────────────────────────────────────────────
  await Promise.all([
    prisma.pointRule.create({ data: { categoryId: trabalho.id, points: 1, weeklyLimit: 10, cooldownHours: 0 } }),
    prisma.pointRule.create({ data: { categoryId: lideranca.id, points: 3, weeklyLimit: 5, cooldownHours: 24 } }),
    prisma.pointRule.create({ data: { categoryId: cultura.id, points: 2, weeklyLimit: 7, cooldownHours: 12 } }),
    prisma.pointRule.create({ data: { categoryId: inovacao.id, points: 2, weeklyLimit: 7, cooldownHours: 12 } }),
    prisma.pointRule.create({ data: { categoryId: ajuda.id, points: 1, weeklyLimit: 10, cooldownHours: 0 } }),
    prisma.pointRule.create({ data: { categoryId: cliente.id, points: 2, weeklyLimit: 7, cooldownHours: 12 } }),
  ]);
  console.log('✅ Regras de pontuação criadas.');

  // ─── Users ───────────────────────────────────────────────────────────────
  const av = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

  // Admin principal (o usuário real da plataforma)
  const raphael = await prisma.user.upsert({
    where: { email: 'raphaelbraga@grupootg.com' },
    update: { role: Role.ADMIN, isActive: true, departmentId: tech.id },
    create: {
      email: 'raphaelbraga@grupootg.com',
      name: 'Raphael Braga',
      avatar: av('raphael'),
      role: Role.ADMIN,
      isActive: true,
      departmentId: tech.id,
    },
  });

  const [camila, beatriz] = await Promise.all([
    prisma.user.create({
      data: { email: 'camila.torres@grupootg.com', name: 'Camila Torres', avatar: av('camila'), role: Role.ADMIN, isActive: true, departmentId: people.id },
    }),
    prisma.user.create({
      data: { email: 'beatriz.alves@grupootg.com', name: 'Beatriz Alves', avatar: av('beatriz'), role: Role.ADMIN, isActive: true, departmentId: people.id },
    }),
  ]);

  const [
    lucas, ana, carlos, fernanda, pedro, juliana,
    mateus, larissa, rodrigo, amanda, gabriel, patricia,
    thiago, mariana, felipe, isabela, gustavo,
  ] = await Promise.all([
    prisma.user.create({ data: { email: 'lucas.ferreira@grupootg.com', name: 'Lucas Ferreira', avatar: av('lucas'), role: Role.USER, isActive: true, departmentId: tech.id } }),
    prisma.user.create({ data: { email: 'ana.lima@grupootg.com', name: 'Ana Lima', avatar: av('ana'), role: Role.USER, isActive: true, departmentId: produto.id } }),
    prisma.user.create({ data: { email: 'carlos.oliveira@grupootg.com', name: 'Carlos Oliveira', avatar: av('carlos'), role: Role.USER, isActive: true, departmentId: tech.id } }),
    prisma.user.create({ data: { email: 'fernanda.costa@grupootg.com', name: 'Fernanda Costa', avatar: av('fernanda'), role: Role.USER, isActive: true, departmentId: marketing.id } }),
    prisma.user.create({ data: { email: 'pedro.alves@grupootg.com', name: 'Pedro Alves', avatar: av('pedro'), role: Role.USER, isActive: true, departmentId: comercial.id } }),
    prisma.user.create({ data: { email: 'juliana.mendes@grupootg.com', name: 'Juliana Mendes', avatar: av('juliana'), role: Role.USER, isActive: true, departmentId: marketing.id } }),
    prisma.user.create({ data: { email: 'mateus.silva@grupootg.com', name: 'Mateus Silva', avatar: av('mateus'), role: Role.USER, isActive: true, departmentId: tech.id } }),
    prisma.user.create({ data: { email: 'larissa.souza@grupootg.com', name: 'Larissa Souza', avatar: av('larissa'), role: Role.USER, isActive: true, departmentId: produto.id } }),
    prisma.user.create({ data: { email: 'rodrigo.nunes@grupootg.com', name: 'Rodrigo Nunes', avatar: av('rodrigo'), role: Role.USER, isActive: true, departmentId: financeiro.id } }),
    prisma.user.create({ data: { email: 'amanda.rocha@grupootg.com', name: 'Amanda Rocha', avatar: av('amanda'), role: Role.USER, isActive: true, departmentId: comercial.id } }),
    prisma.user.create({ data: { email: 'gabriel.martins@grupootg.com', name: 'Gabriel Martins', avatar: av('gabriel'), role: Role.USER, isActive: true, departmentId: tech.id } }),
    prisma.user.create({ data: { email: 'patricia.lima@grupootg.com', name: 'Patricia Lima', avatar: av('patricia'), role: Role.USER, isActive: true, departmentId: financeiro.id } }),
    prisma.user.create({ data: { email: 'thiago.santos@grupootg.com', name: 'Thiago Santos', avatar: av('thiago'), role: Role.USER, isActive: true, departmentId: comercial.id } }),
    prisma.user.create({ data: { email: 'mariana.dias@grupootg.com', name: 'Mariana Dias', avatar: av('mariana'), role: Role.USER, isActive: true, departmentId: produto.id } }),
    prisma.user.create({ data: { email: 'felipe.araujo@grupootg.com', name: 'Felipe Araújo', avatar: av('felipe'), role: Role.USER, isActive: true, departmentId: marketing.id } }),
    prisma.user.create({ data: { email: 'isabela.gomes@grupootg.com', name: 'Isabela Gomes', avatar: av('isabela'), role: Role.USER, isActive: true, departmentId: people.id } }),
    prisma.user.create({ data: { email: 'gustavo.pereira@grupootg.com', name: 'Gustavo Pereira', avatar: av('gustavo'), role: Role.USER, isActive: true, departmentId: tech.id } }),
  ]);
  console.log('✅ Usuários criados.');

  const all = [raphael, camila, beatriz, lucas, ana, carlos, fernanda, pedro, juliana,
    mateus, larissa, rodrigo, amanda, gabriel, patricia, thiago, mariana, felipe, isabela, gustavo];

  // ─── Kudos Posts (50+) ───────────────────────────────────────────────────
  type PostInput = {
    message: string;
    authorId: string;
    recipientId: string;
    categoryId: string;
    createdAt: Date;
  };

  const posts: PostInput[] = [
    // Semana atual
    { message: 'O Lucas resolveu um bug crítico de produção em tempo recorde. Seu comprometimento com a estabilidade do sistema é admirável!', authorId: raphael.id, recipientId: lucas.id, categoryId: inovacao.id, createdAt: daysAgo(1) },
    { message: 'A Ana conduziu a discovery do novo módulo com muita clareza. Ela transformou requisitos confusos em um roadmap sólido e inspirador.', authorId: carlos.id, recipientId: ana.id, categoryId: lideranca.id, createdAt: daysAgo(1) },
    { message: 'Carlos refatorou todo o módulo de autenticação com qualidade excepcional. O código ficou limpo, seguro e bem documentado.', authorId: lucas.id, recipientId: carlos.id, categoryId: trabalho.id, createdAt: daysAgo(2) },
    { message: 'Fernanda criou uma campanha de lançamento incrível do zero. As métricas de engajamento superaram todas as expectativas da equipe.', authorId: ana.id, recipientId: fernanda.id, categoryId: inovacao.id, createdAt: daysAgo(2) },
    { message: 'Pedro fechou o maior contrato do trimestre após meses de negociação. Sua persistência e habilidade de entender o cliente foram fundamentais.', authorId: raphael.id, recipientId: pedro.id, categoryId: cliente.id, createdAt: daysAgo(3) },
    { message: 'Camila transformou completamente nosso processo de onboarding. O novo fluxo é muito mais humano e os novos colaboradores adoraram!', authorId: beatriz.id, recipientId: camila.id, categoryId: cultura.id, createdAt: daysAgo(3) },
    { message: 'Mateus propôs e implementou um sistema de cache que reduziu em 60% o tempo de resposta. Solução elegante com impacto real!', authorId: carlos.id, recipientId: mateus.id, categoryId: inovacao.id, createdAt: daysAgo(4) },
    { message: 'Larissa foi além das suas entregas e ajudou o time de marketing a estruturar os requisitos do produto. Parceria impecável!', authorId: fernanda.id, recipientId: larissa.id, categoryId: ajuda.id, createdAt: daysAgo(4) },
    { message: 'Rodrigo entregou o fechamento financeiro do mês antes do prazo, com precisão total. Permite que toda a empresa tome decisões melhores.', authorId: camila.id, recipientId: rodrigo.id, categoryId: cliente.id, createdAt: daysAgo(5) },
    { message: 'Amanda captou um cliente estratégico após 4 meses de relacionamento. Seu cuidado com cada detalhe da negociação foi decisivo.', authorId: pedro.id, recipientId: amanda.id, categoryId: cliente.id, createdAt: daysAgo(5) },

    // Semana passada
    { message: 'Gabriel mentoreou dois devs juniors com muita paciência e didática. Em poucas semanas eles já estão entregando de forma independente!', authorId: raphael.id, recipientId: gabriel.id, categoryId: lideranca.id, createdAt: daysAgo(8) },
    { message: 'Patricia identificou uma inconsistência nos relatórios que ninguém tinha percebido. Sua atenção aos detalhes salvou a empresa de uma decisão errada.', authorId: rodrigo.id, recipientId: patricia.id, categoryId: cultura.id, createdAt: daysAgo(8) },
    { message: 'Thiago apresentou nossa solução para o cliente mais difícil com confiança e clareza. A renovação foi garantida graças à sua postura profissional.', authorId: amanda.id, recipientId: thiago.id, categoryId: cliente.id, createdAt: daysAgo(9) },
    { message: 'Mariana redesenhou todo o fluxo de onboarding do produto em tempo recorde. A taxa de conclusão já subiu 35%!', authorId: ana.id, recipientId: mariana.id, categoryId: inovacao.id, createdAt: daysAgo(9) },
    { message: 'Felipe trouxe insights incríveis do mercado que mudaram a direção da nossa próxima campanha. Visão estratégica de altíssimo nível.', authorId: juliana.id, recipientId: felipe.id, categoryId: inovacao.id, createdAt: daysAgo(10) },
    { message: 'Isabela organizou o workshop de valores com uma energia incrível. Todo mundo saiu mais conectado com a missão da empresa.', authorId: camila.id, recipientId: isabela.id, categoryId: cultura.id, createdAt: daysAgo(10) },
    { message: 'Gustavo implementou a nova pipeline de CI/CD que reduziu o tempo de deploy de 20 minutos para 3. Produtividade de todo o time aumentou!', authorId: mateus.id, recipientId: gustavo.id, categoryId: inovacao.id, createdAt: daysAgo(11) },
    { message: 'Raphael foi além das suas responsabilidades e ajudou o time de produto a mapear requisitos técnicos críticos. Visão sistêmica impressionante.', authorId: lucas.id, recipientId: raphael.id, categoryId: trabalho.id, createdAt: daysAgo(11) },
    { message: 'Ana liderou a cerimônia de retrospectiva gerando ações reais com dono e prazo. O time saiu muito mais alinhado e motivado.', authorId: larissa.id, recipientId: ana.id, categoryId: lideranca.id, createdAt: daysAgo(12) },
    { message: 'Carlos fez pair programming com todos os devs juniores essa semana. Generosidade com o conhecimento que transforma o time inteiro.', authorId: gabriel.id, recipientId: carlos.id, categoryId: ajuda.id, createdAt: daysAgo(12) },

    // 2-3 semanas atrás
    { message: 'Pedro trouxe um feedback de cliente que virou uma nova funcionalidade no roadmap. Sua proximidade com o mercado tem impacto direto no produto!', authorId: ana.id, recipientId: pedro.id, categoryId: cliente.id, createdAt: daysAgo(15) },
    { message: 'Juliana produziu os materiais do evento interno com um cuidado artístico incrível. Cada detalhe foi pensado para representar nossa cultura.', authorId: fernanda.id, recipientId: juliana.id, categoryId: cultura.id, createdAt: daysAgo(15) },
    { message: 'Beatriz estruturou o programa de feedback contínuo que já está transformando as relações entre líderes e times. Iniciativa de enorme impacto!', authorId: camila.id, recipientId: beatriz.id, categoryId: lideranca.id, createdAt: daysAgo(16) },
    { message: 'Lucas e Mateus fizeram um pair incrível e entregaram a feature de integração com qualidade muito acima do esperado. Dupla imbatível!', authorId: carlos.id, recipientId: lucas.id, categoryId: trabalho.id, createdAt: daysAgo(16) },
    { message: 'Rodrigo automatizou os relatórios mensais economizando 8 horas de trabalho manual por mês. Pensamento sistêmico que libera tempo para o que importa.', authorId: patricia.id, recipientId: rodrigo.id, categoryId: inovacao.id, createdAt: daysAgo(17) },
    { message: 'Amanda organizou o jantar de celebração dos resultados do trimestre com muito capricho. O time se sentiu genuinamente valorizado!', authorId: thiago.id, recipientId: amanda.id, categoryId: cultura.id, createdAt: daysAgo(17) },
    { message: 'Gabriel implementou observabilidade completa na plataforma. Agora conseguimos identificar e resolver problemas antes que afetem os usuários.', authorId: gustavo.id, recipientId: gabriel.id, categoryId: inovacao.id, createdAt: daysAgo(18) },
    { message: 'Mariana apresentou o roadmap de produto para toda a empresa com uma narrativa clara e empolgante. A visão ficou cristalina para todos!', authorId: larissa.id, recipientId: mariana.id, categoryId: lideranca.id, createdAt: daysAgo(18) },
    { message: 'Felipe criou uma série de conteúdos que posicionou a OTG como referência no mercado. Estratégia de branding de altíssimo nível!', authorId: juliana.id, recipientId: felipe.id, categoryId: cultura.id, createdAt: daysAgo(19) },
    { message: 'Isabela conduziu as entrevistas de desligamento com tanto cuidado e empatia que os ex-colaboradores saíram como embaixadores da empresa.', authorId: beatriz.id, recipientId: isabela.id, categoryId: cliente.id, createdAt: daysAgo(19) },

    // Mês passado
    { message: 'Thiago e Amanda fecharam juntos o maior contrato da história da OTG Comercial. Trabalho em equipe e resiliência que movem montanhas!', authorId: pedro.id, recipientId: thiago.id, categoryId: trabalho.id, createdAt: daysAgo(32) },
    { message: 'Camila reestruturou a política de benefícios ouvindo todos os colaboradores. Iniciativa que mostra o quanto a People se importa de verdade.', authorId: isabela.id, recipientId: camila.id, categoryId: cultura.id, createdAt: daysAgo(32) },
    { message: 'Carlos liderou a migração de infraestrutura sem downtime nenhum. Planejamento impecável e execução ainda melhor. Time Tecnologia voando!', authorId: raphael.id, recipientId: carlos.id, categoryId: lideranca.id, createdAt: daysAgo(33) },
    { message: 'Ana entregou a discovery do produto principal antes do prazo e com uma qualidade de documentação que serve de referência para toda a empresa.', authorId: mariana.id, recipientId: ana.id, categoryId: trabalho.id, createdAt: daysAgo(33) },
    { message: 'Fernanda coordenou o lançamento de três campanhas simultâneas sem perder qualidade em nenhuma. Capacidade de execução fora do comum!', authorId: felipe.id, recipientId: fernanda.id, categoryId: lideranca.id, createdAt: daysAgo(34) },
    { message: 'Gustavo criou um dashboard de monitoramento que todo o time usa diariamente. Simplificou decisões técnicas que antes tomavam horas de análise.', authorId: gabriel.id, recipientId: gustavo.id, categoryId: cliente.id, createdAt: daysAgo(34) },
    { message: 'Patricia apresentou os resultados financeiros de forma tão clara que pela primeira vez todos os líderes entenderam os números sem ajuda. Transformador!', authorId: rodrigo.id, recipientId: patricia.id, categoryId: lideranca.id, createdAt: daysAgo(35) },
    { message: 'Larissa mapeou toda a jornada do usuário no produto identificando 12 pontos de atrito que ninguém havia documentado. Trabalho de detetive!', authorId: ana.id, recipientId: larissa.id, categoryId: inovacao.id, createdAt: daysAgo(35) },
    { message: 'Mateus refatorou o sistema de notificações reduzindo o número de bugs reportados em 80%. Impacto direto na satisfação dos clientes!', authorId: lucas.id, recipientId: mateus.id, categoryId: cliente.id, createdAt: daysAgo(36) },
    { message: 'Rodrigo implementou controles financeiros que eliminaram completamente os erros de reconciliação. Economia real de tempo e dinheiro para a empresa.', authorId: patricia.id, recipientId: rodrigo.id, categoryId: trabalho.id, createdAt: daysAgo(36) },

    // 2 meses atrás
    { message: 'Raphael arquitetou a nova plataforma de microsserviços com documentação impecável. Qualquer dev consegue contribuir agora. Legado inestimável!', authorId: mateus.id, recipientId: raphael.id, categoryId: inovacao.id, createdAt: daysAgo(52) },
    { message: 'Beatriz implementou o programa de reconhecimento peer-to-peer que já virou parte da cultura da empresa. O Pulse nasceu daqui!', authorId: camila.id, recipientId: beatriz.id, categoryId: cultura.id, createdAt: daysAgo(52) },
    { message: 'Amanda superou a meta de vendas em 140% no trimestre. Consistência, dedicação e foco no cliente que inspira todo o time Comercial!', authorId: pedro.id, recipientId: amanda.id, categoryId: cliente.id, createdAt: daysAgo(53) },
    { message: 'Gabriel liderou a squad de plataforma com muita maturidade. Decisões técnicas sólidas, comunicação transparente e entrega consistente.', authorId: lucas.id, recipientId: gabriel.id, categoryId: lideranca.id, createdAt: daysAgo(53) },
    { message: 'Felipe e Juliana criaram juntos a identidade visual da nova campanha de marca. O resultado ficou tão bom que foi premiado externamente!', authorId: fernanda.id, recipientId: felipe.id, categoryId: trabalho.id, createdAt: daysAgo(54) },
    { message: 'Mariana conduziu os testes de usabilidade que revelaram problemas críticos antes do lançamento. Salvou o produto de uma péssima primeira impressão.', authorId: larissa.id, recipientId: mariana.id, categoryId: cliente.id, createdAt: daysAgo(54) },
    { message: 'Isabela criou o plano de desenvolvimento individual para toda a empresa. Cada colaborador agora tem um norte claro para crescer!', authorId: beatriz.id, recipientId: isabela.id, categoryId: lideranca.id, createdAt: daysAgo(55) },
    { message: 'Thiago bateu o recorde histórico de NPS com clientes do seu segmento. Relacionamento genuíno construído ao longo de meses de dedicação.', authorId: amanda.id, recipientId: thiago.id, categoryId: cliente.id, createdAt: daysAgo(55) },
    { message: 'Carlos e Gustavo resolveram o maior incidente de segurança da história da empresa em 4 horas. Trabalho heroico que protegeu todos os nossos clientes.', authorId: raphael.id, recipientId: gustavo.id, categoryId: trabalho.id, createdAt: daysAgo(56) },
    { message: 'Camila liderou as conversas difíceis de cultura com coragem e empatia. Clima do time melhorou visivelmente após as sessões que ela facilitou.', authorId: isabela.id, recipientId: camila.id, categoryId: lideranca.id, createdAt: daysAgo(56) },
    { message: 'Ana e Larissa fizeram a discovery mais completa que já vi nessa empresa. Foram a campo, entrevistaram 30 clientes e transformaram tudo em insights acionáveis.', authorId: mariana.id, recipientId: ana.id, categoryId: inovacao.id, createdAt: daysAgo(57) },
    { message: 'Lucas implementou testes automatizados que cobrem 90% do código crítico. Qualidade e confiança nas entregas atingiram um novo patamar!', authorId: carlos.id, recipientId: lucas.id, categoryId: trabalho.id, createdAt: daysAgo(57) },
  ];

  const createdPosts = await Promise.all(
    posts.map((p) => prisma.kudosPost.create({ data: p })),
  );
  console.log(`✅ ${createdPosts.length} kudos criados.`);

  // ─── Likes ───────────────────────────────────────────────────────────────
  const likePairs: Array<{ userId: string; postId: string }> = [];

  createdPosts.forEach((post, i) => {
    const likers = all
      .filter((u) => u.id !== post.authorId && u.id !== post.recipientId)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 8) + 2);

    likers.forEach((u) => {
      if (!likePairs.some((lp) => lp.userId === u.id && lp.postId === post.id)) {
        likePairs.push({ userId: u.id, postId: post.id });
      }
    });

    // Posts mais antigos têm mais likes
    if (i > 30) {
      const extraLikers = all
        .filter((u) => u.id !== post.authorId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      extraLikers.forEach((u) => {
        if (!likePairs.some((lp) => lp.userId === u.id && lp.postId === post.id)) {
          likePairs.push({ userId: u.id, postId: post.id });
        }
      });
    }
  });

  await prisma.kudosLike.createMany({ data: likePairs, skipDuplicates: true });
  console.log(`✅ ${likePairs.length} curtidas criadas.`);

  // ─── Badges ──────────────────────────────────────────────────────────────
  const [
    risingStar, galactico, teamPlayer, inovador, lendaOtg, mvp, maisQuerido, mentor,
  ] = await Promise.all([
    prisma.badge.create({ data: { name: 'Rising Star', slug: 'rising-star', description: 'Novo talento que já brilha', icon: '🚀', color: '#6366f1', rarity: BadgeRarity.COMMON } }),
    prisma.badge.create({ data: { name: 'Galáctico do Mês', slug: 'galactico-do-mes', description: 'Top 1 do ranking mensal', icon: '🔥', color: '#f59e0b', rarity: BadgeRarity.RARE } }),
    prisma.badge.create({ data: { name: 'Team Player', slug: 'team-player', description: 'Parceiro incansável de equipe', icon: '🤝', color: '#22c55e', rarity: BadgeRarity.COMMON } }),
    prisma.badge.create({ data: { name: 'Inovador', slug: 'inovador', description: 'Sempre traz ideias novas', icon: '💡', color: '#8b5cf6', rarity: BadgeRarity.UNCOMMON } }),
    prisma.badge.create({ data: { name: 'Lenda OTG', slug: 'lenda-otg', description: 'Histórico impecável na empresa', icon: '🏆', color: '#ec4899', rarity: BadgeRarity.LEGENDARY } }),
    prisma.badge.create({ data: { name: 'MVP', slug: 'mvp', description: 'Most Valuable Player da temporada', icon: '⚡', color: '#eab308', rarity: BadgeRarity.EPIC } }),
    prisma.badge.create({ data: { name: 'Mais Querido', slug: 'mais-querido', description: 'O favorito de todos', icon: '❤️', color: '#ef4444', rarity: BadgeRarity.RARE } }),
    prisma.badge.create({ data: { name: 'Mentor', slug: 'mentor', description: 'Eleva o nível de quem está ao redor', icon: '🧠', color: '#14b8a6', rarity: BadgeRarity.EPIC } }),
  ]);
  console.log('✅ Badges criados.');

  // Award badges
  await Promise.all([
    prisma.userBadge.create({ data: { userId: raphael.id, badgeId: lendaOtg.id } }),
    prisma.userBadge.create({ data: { userId: raphael.id, badgeId: mentor.id } }),
    prisma.userBadge.create({ data: { userId: raphael.id, badgeId: inovador.id } }),
    prisma.userBadge.create({ data: { userId: lucas.id, badgeId: risingStar.id } }),
    prisma.userBadge.create({ data: { userId: lucas.id, badgeId: teamPlayer.id } }),
    prisma.userBadge.create({ data: { userId: ana.id, badgeId: mvp.id } }),
    prisma.userBadge.create({ data: { userId: ana.id, badgeId: maisQuerido.id } }),
    prisma.userBadge.create({ data: { userId: carlos.id, badgeId: mentor.id } }),
    prisma.userBadge.create({ data: { userId: carlos.id, badgeId: inovador.id } }),
    prisma.userBadge.create({ data: { userId: gabriel.id, badgeId: galactico.id } }),
    prisma.userBadge.create({ data: { userId: gabriel.id, badgeId: mvp.id } }),
    prisma.userBadge.create({ data: { userId: amanda.id, badgeId: maisQuerido.id } }),
    prisma.userBadge.create({ data: { userId: camila.id, badgeId: lendaOtg.id } }),
    prisma.userBadge.create({ data: { userId: camila.id, badgeId: teamPlayer.id } }),
    prisma.userBadge.create({ data: { userId: gustavo.id, badgeId: risingStar.id } }),
    prisma.userBadge.create({ data: { userId: mateus.id, badgeId: inovador.id } }),
    prisma.userBadge.create({ data: { userId: fernanda.id, badgeId: galactico.id } }),
  ]);
  console.log('✅ Badges atribuídas aos usuários.');

  // ─── Achievements ─────────────────────────────────────────────────────────
  const [ach10, ach5senders, ach20sent, ach5depts, ach50received] = await Promise.all([
    prisma.achievement.create({ data: { name: '10 Kudos Recebidos', description: 'Recebeu 10 reconhecimentos', type: 'KUDOS_RECEIVED', conditionValue: 10, icon: '🌟' } }),
    prisma.achievement.create({ data: { name: 'Popular!', description: 'Recebeu kudos de 5 pessoas diferentes', type: 'UNIQUE_SENDERS', conditionValue: 5, icon: '🎯' } }),
    prisma.achievement.create({ data: { name: 'Generoso', description: 'Enviou 20 reconhecimentos', type: 'KUDOS_SENT', conditionValue: 20, icon: '🎁' } }),
    prisma.achievement.create({ data: { name: 'Cross-Departamento', description: 'Recebeu kudos de 4 departamentos diferentes', type: 'UNIQUE_DEPARTMENTS', conditionValue: 4, icon: '🌐' } }),
    prisma.achievement.create({ data: { name: 'Lenda Viva', description: 'Recebeu 50 reconhecimentos', type: 'KUDOS_RECEIVED', conditionValue: 50, icon: '👑' } }),
  ]);
  console.log('✅ Conquistas criadas.');

  // Grant some achievements
  await Promise.all([
    prisma.userAchievement.create({ data: { userId: raphael.id, achievementId: ach10.id, progress: 4, completed: true, completedAt: daysAgo(20) } }),
    prisma.userAchievement.create({ data: { userId: raphael.id, achievementId: ach5senders.id, progress: 5, completed: true, completedAt: daysAgo(15) } }),
    prisma.userAchievement.create({ data: { userId: ana.id, achievementId: ach10.id, progress: 10, completed: true, completedAt: daysAgo(10) } }),
    prisma.userAchievement.create({ data: { userId: ana.id, achievementId: ach5senders.id, progress: 5, completed: true, completedAt: daysAgo(8) } }),
    prisma.userAchievement.create({ data: { userId: ana.id, achievementId: ach5depts.id, progress: 4, completed: true, completedAt: daysAgo(5) } }),
    prisma.userAchievement.create({ data: { userId: lucas.id, achievementId: ach10.id, progress: 10, completed: true, completedAt: daysAgo(12) } }),
    prisma.userAchievement.create({ data: { userId: carlos.id, achievementId: ach20sent.id, progress: 20, completed: true, completedAt: daysAgo(7) } }),
    prisma.userAchievement.create({ data: { userId: gabriel.id, achievementId: ach50received.id, progress: 7, completed: false } }),
    prisma.userAchievement.create({ data: { userId: camila.id, achievementId: ach10.id, progress: 10, completed: true, completedAt: daysAgo(18) } }),
    prisma.userAchievement.create({ data: { userId: gustavo.id, achievementId: ach10.id, progress: 5, completed: false } }),
  ]);
  console.log('✅ Conquistas distribuídas.');

  // ─── Seasons ─────────────────────────────────────────────────────────────
  const seasonAbril = await prisma.season.create({
    data: {
      name: 'Temporada Abril 2026',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-30'),
      active: false,
    },
  });

  const seasonMaio = await prisma.season.create({
    data: {
      name: 'Temporada Maio 2026',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-31'),
      active: true,
    },
  });

  // Abril rankings (hall of fame)
  await Promise.all([
    prisma.seasonRanking.create({ data: { seasonId: seasonAbril.id, userId: gabriel.id, position: 1, points: 47 } }),
    prisma.seasonRanking.create({ data: { seasonId: seasonAbril.id, userId: ana.id, position: 2, points: 38 } }),
    prisma.seasonRanking.create({ data: { seasonId: seasonAbril.id, userId: lucas.id, position: 3, points: 31 } }),
    prisma.seasonRanking.create({ data: { seasonId: seasonAbril.id, userId: amanda.id, position: 4, points: 22 } }),
    prisma.seasonRanking.create({ data: { seasonId: seasonAbril.id, userId: carlos.id, position: 5, points: 19 } }),
  ]);

  // Maio rankings (current - partial)
  await Promise.all([
    prisma.seasonRanking.create({ data: { seasonId: seasonMaio.id, userId: ana.id, position: 1, points: 28 } }),
    prisma.seasonRanking.create({ data: { seasonId: seasonMaio.id, userId: raphael.id, position: 2, points: 21 } }),
    prisma.seasonRanking.create({ data: { seasonId: seasonMaio.id, userId: carlos.id, position: 3, points: 18 } }),
    prisma.seasonRanking.create({ data: { seasonId: seasonMaio.id, userId: lucas.id, position: 4, points: 15 } }),
    prisma.seasonRanking.create({ data: { seasonId: seasonMaio.id, userId: gustavo.id, position: 5, points: 12 } }),
  ]);
  console.log('✅ Temporadas criadas.');

  // ─── Reactions ───────────────────────────────────────────────────────────
  const reactionData: Array<{ userId: string; postId: string; reactionType: ReactionType }> = [];
  const reactionTypes: ReactionType[] = ['FIRE', 'ROCKET', 'HEART', 'CLAP', 'BRAIN'];

  createdPosts.forEach((post, i) => {
    const reactors = all
      .filter((u) => u.id !== post.authorId)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 7) + 3);

    reactors.forEach((u, j) => {
      const type = reactionTypes[(i + j) % reactionTypes.length];
      if (!reactionData.some((r) => r.userId === u.id && r.postId === post.id && r.reactionType === type)) {
        reactionData.push({ userId: u.id, postId: post.id, reactionType: type });
      }
    });

    // Posts recentes têm mais reações variadas
    if (i < 15) {
      const bonusReactors = all
        .filter((u) => u.id !== post.authorId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      bonusReactors.forEach((u, j) => {
        const type = reactionTypes[(i + j + 2) % reactionTypes.length];
        if (!reactionData.some((r) => r.userId === u.id && r.postId === post.id && r.reactionType === type)) {
          reactionData.push({ userId: u.id, postId: post.id, reactionType: type });
        }
      });
    }
  });

  await prisma.kudosReaction.createMany({ data: reactionData, skipDuplicates: true });
  console.log(`✅ ${reactionData.length} reações criadas.`);

  // ─── Comments ────────────────────────────────────────────────────────────
  const commentsData = [
    // Post 0 - Lucas bug crítico
    { postId: createdPosts[0].id, authorId: mateus.id, message: 'Merecia muito esse reconhecimento! 🚀' },
    { postId: createdPosts[0].id, authorId: ana.id, message: 'Concordo 100%! Lucas arrasou em tempo recorde!' },
    { postId: createdPosts[0].id, authorId: gabriel.id, message: 'Cara, o Lucas salvou o dia mesmo. Chapéu!' },
    // Post 1 - Ana discovery
    { postId: createdPosts[1].id, authorId: lucas.id, message: 'Ana é incrível, referência de discovery na empresa toda!' },
    { postId: createdPosts[1].id, authorId: fernanda.id, message: '👏👏 muito merecido! Ela transformou o caos em clareza.' },
    { postId: createdPosts[1].id, authorId: mariana.id, message: 'Aprendo muito com a Ana sempre. Exemplo de PM!' },
    // Post 2 - Carlos refactor
    { postId: createdPosts[2].id, authorId: mateus.id, message: 'Aquele PR foi magistral, aprendi muito vendo o código!' },
    { postId: createdPosts[2].id, authorId: gustavo.id, message: 'Carlos eleva o nível de todo o time 🔥' },
    // Post 3 - Fernanda campanha
    { postId: createdPosts[3].id, authorId: juliana.id, message: 'A campanha ficou incrível! Orgulho da Fernanda 🔥' },
    { postId: createdPosts[3].id, authorId: felipe.id, message: 'As métricas foram absurdas. Fernanda é top demais!' },
    // Post 4 - Pedro contrato
    { postId: createdPosts[4].id, authorId: thiago.id, message: 'Pedro é o cara! Esse contrato foi histórico pra empresa!' },
    { postId: createdPosts[4].id, authorId: amanda.id, message: 'Meses de trabalho duro resultando nisso 💪' },
    // Post 5 - Camila onboarding
    { postId: createdPosts[5].id, authorId: isabela.id, message: 'Camila sempre elevando o bar do onboarding 💙' },
    { postId: createdPosts[5].id, authorId: beatriz.id, message: 'Tão orgulhosa do trabalho dela. Time People brilhando!' },
    // Post 6 - Mateus cache
    { postId: createdPosts[6].id, authorId: gabriel.id, message: '60% de redução? Isso é resultado de verdade, parabéns!' },
    { postId: createdPosts[6].id, authorId: carlos.id, message: 'Solução elegante e com impacto real. Mateus é fora da curva.' },
    // Post 7 - Larissa
    { postId: createdPosts[7].id, authorId: ana.id, message: 'Larissa é parceira demais. Exemplo pra toda a empresa!' },
    // Post 10 - Gabriel mentor
    { postId: createdPosts[10].id, authorId: carlos.id, message: 'Gabriel mentor top! Meus juniores cresceram muito com ele 🧠' },
    { postId: createdPosts[10].id, authorId: lucas.id, message: 'Ele pegou no meu calo várias vezes. Muito grato!' },
    // Post 11 - Patricia
    { postId: createdPosts[11].id, authorId: rodrigo.id, message: 'Patricia salva vidas! Seria um baita erro sem ela.' },
    // Post 15 - Isabela workshop
    { postId: createdPosts[15].id, authorId: camila.id, message: 'Isabela é a alma da cultura OTG ❤️' },
    { postId: createdPosts[15].id, authorId: beatriz.id, message: 'Workshop mais incrível que já participei aqui!' },
    // Post 16 - Gustavo pipeline
    { postId: createdPosts[16].id, authorId: mateus.id, message: 'Gustavo pipeline pra sempre! Deploy em 3 min é vida 🚀' },
    { postId: createdPosts[16].id, authorId: carlos.id, message: 'Mudou completamente nosso workflow de entrega. Fantástico!' },
    // Post 20+
    { postId: createdPosts[20].id, authorId: larissa.id, message: 'Pedro sempre trazendo o cliente para o centro. Inspirador!' },
    { postId: createdPosts[22].id, authorId: camila.id, message: 'Beatriz é a razão do Pulse existir! ❤️' },
    { postId: createdPosts[24].id, authorId: patricia.id, message: 'Rodrigo automatizou o impossível. Que cérebro!' },
    { postId: createdPosts[30].id, authorId: gustavo.id, message: 'Raphael é nossa maior referência técnica. Lenda!' },
    { postId: createdPosts[31].id, authorId: isabela.id, message: 'Camila é insubstituível. People tem sorte enorme!' },
  ];

  await prisma.kudosComment.createMany({ data: commentsData, skipDuplicates: true });
  console.log(`✅ ${commentsData.length} comentários criados.`);

  // ─── Profile Votes ────────────────────────────────────────────────────────
  const votePairs: Array<{ voterId: string; targetId: string; type: VoteType }> = [
    { voterId: lucas.id, targetId: raphael.id, type: VoteType.TRUSTWORTHY },
    { voterId: ana.id, targetId: raphael.id, type: VoteType.TRUSTWORTHY },
    { voterId: carlos.id, targetId: raphael.id, type: VoteType.PROFESSIONAL },
    { voterId: mateus.id, targetId: raphael.id, type: VoteType.COOL },
    { voterId: gabriel.id, targetId: raphael.id, type: VoteType.PROFESSIONAL },
    { voterId: raphael.id, targetId: lucas.id, type: VoteType.TRUSTWORTHY },
    { voterId: carlos.id, targetId: lucas.id, type: VoteType.COOL },
    { voterId: mateus.id, targetId: lucas.id, type: VoteType.PROFESSIONAL },
    { voterId: raphael.id, targetId: ana.id, type: VoteType.PROFESSIONAL },
    { voterId: lucas.id, targetId: ana.id, type: VoteType.TRUSTWORTHY },
    { voterId: fernanda.id, targetId: ana.id, type: VoteType.COOL },
    { voterId: mariana.id, targetId: ana.id, type: VoteType.TRUSTWORTHY },
    { voterId: raphael.id, targetId: carlos.id, type: VoteType.PROFESSIONAL },
    { voterId: lucas.id, targetId: carlos.id, type: VoteType.TRUSTWORTHY },
    { voterId: mateus.id, targetId: carlos.id, type: VoteType.COOL },
    { voterId: ana.id, targetId: gabriel.id, type: VoteType.PROFESSIONAL },
    { voterId: lucas.id, targetId: gabriel.id, type: VoteType.TRUSTWORTHY },
    { voterId: carlos.id, targetId: gabriel.id, type: VoteType.COOL },
    { voterId: pedro.id, targetId: amanda.id, type: VoteType.PROFESSIONAL },
    { voterId: thiago.id, targetId: amanda.id, type: VoteType.TRUSTWORTHY },
    { voterId: fernanda.id, targetId: juliana.id, type: VoteType.COOL },
    { voterId: isabela.id, targetId: camila.id, type: VoteType.TRUSTWORTHY },
    { voterId: beatriz.id, targetId: camila.id, type: VoteType.PROFESSIONAL },
  ];

  await prisma.profileVote.createMany({ data: votePairs, skipDuplicates: true });
  console.log(`✅ ${votePairs.length} votos de perfil criados.`);

  // ─── Profile Visits ───────────────────────────────────────────────────────
  const visitData = [
    { visitorId: lucas.id, profileId: raphael.id },
    { visitorId: ana.id, profileId: raphael.id },
    { visitorId: carlos.id, profileId: raphael.id },
    { visitorId: fernanda.id, profileId: raphael.id },
    { visitorId: gabriel.id, profileId: ana.id },
    { visitorId: lucas.id, profileId: ana.id },
    { visitorId: mateus.id, profileId: ana.id },
    { visitorId: raphael.id, profileId: lucas.id },
    { visitorId: ana.id, profileId: carlos.id },
    { visitorId: mateus.id, profileId: gabriel.id },
    { visitorId: larissa.id, profileId: gabriel.id },
    { visitorId: rodrigo.id, profileId: amanda.id },
    { visitorId: pedro.id, profileId: thiago.id },
  ];

  await prisma.profileVisit.createMany({ data: visitData, skipDuplicates: false });
  console.log(`✅ ${visitData.length} visitas de perfil criadas.`);

  console.log('\n🎉 Seed Fase 3 completo! Gamificação ativa.');
  console.log(`   Admin: raphaelbraga@grupootg.com`);
}

main()
  .catch((error) => {
    console.error('❌ Seed falhou:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
