import { PrismaClient, Role, BadgeRarity, ReactionType, VoteType, CommunityMemberRole } from '@prisma/client';

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

  // ─── Communities ─────────────────────────────────────────────────────────
  console.log('\n🏘️  Criando comunidades...');

  const comm = (
    slug: string, name: string, description: string, category: string,
    avatarUrl: string, bannerUrl: string, location: string,
    isOfficial: boolean, createdById: string,
  ) => prisma.community.create({
    data: { slug, name, description, category, avatarUrl, bannerUrl,
      location, isOfficial, language: 'Português (Brasil)', createdById,
      visibility: 'PUBLIC', status: 'ACTIVE',
    },
  });

  const av2 = (seed: string, bg: string) =>
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg.replace('#', '')}`;

  const [
    cDevs, cCafe, cDeploy, cFrontend, cCultura, cGalacticos,
    cMemes, cProduto, cVida, cTata, cBya, cSamuka,
  ] = await Promise.all([
    comm('devs-otg', 'Devs OTG', 'O cantinho dos devs que preferem debugar do que dormir. Aqui rola review de código, memes de programação e aquele suporte na madrugada quando o deploy foi embora.', 'Tecnologia', av2('Devs OTG', '#6366f1'), 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=60', 'OTG HQ', true, raphael.id),
    comm('cafe-e-codigo', 'Café e Código', 'Só entra quem já tomou café antes da daily. Comunidade dos que acreditam que boas ideias nascem com a segunda xícara. Discussões técnicas e muito espresso.', 'Estilo de Vida', av2('Café', '#f59e0b'), 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=60', 'Brasil', false, lucas.id),
    comm('deploy-sem-medo', 'Deploy sem Medo', 'Relatos de sexta às 17h59. Histórias de produção em chamas. Sobreviventes contam suas aventuras. Aqui ninguém te julga por ter deployado na sexta.', 'Tecnologia', av2('Deploy', '#ef4444'), 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=60', 'OTG HQ', false, carlos.id),
    comm('frontend-lovers', 'Frontend Lovers', 'CSS não é difícil, é só arte abstrata. React, Vue, Angular? Aqui discutimos tudo com carinho e apenas um pouquinho de toxicidade sobre frameworks.', 'Tecnologia', av2('FE', '#8b5cf6'), 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=60', 'Brasil', false, mateus.id),
    comm('cultura-otg', 'Cultura OTG', 'Os valores da OTG em formato de comunidade. Rituais, tradições, boas práticas e aquela vibe de quem faz acontecer. Comunidade oficial da nossa identidade.', 'Cultura', av2('Cultura', '#ec4899'), 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=60', 'OTG HQ', true, camila.id),
    comm('galacticos-otg', 'Galácticos OTG', 'Hall dos que brilham mais. Reconhecimentos especiais, conquistas épicas e os melhores momentos de quem deu tudo pela OTG. Elenco dos sonhos.', 'Reconhecimento', av2('Galácticos', '#eab308'), 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=60', 'OTG HQ', true, beatriz.id),
    comm('memes-corporativos', 'Memes Corporativos', 'Reunião que poderia ser e-mail? Temos um meme pra isso. Deadline impossível? Meme. Daily de segunda? Definitivamente meme. Canal sagrado da saúde mental.', 'Diversão', av2('Memes', '#10b981'), 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&q=60', 'Brasil', false, gabriel.id),
    comm('produto-e-discovery', 'Produto & Discovery', 'PMs, designers e devs curiosos. Aqui falamos de pesquisa com usuário, frameworks de priorização e aquele eterno debate: é bug ou é feature?', 'Produto', av2('Produto', '#3b82f6'), 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=60', 'OTG HQ', false, ana.id),
    comm('vida-saudavel', 'Vida Saudável', 'Saúde mental não é luxo, é pré-requisito. Dicas de bem-estar, rotinas de movimento, receitas e aquele incentivo pra sair da cadeira de vez em quando.', 'Saúde', av2('Vida', '#22c55e'), 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=60', 'Brasil', false, isabela.id),
    comm('eu-conheco-a-tata-do-rh', 'Eu Conheço a Tata do RH', 'Comunidade sagrada dos que já foram parar na sala da Tata e sobreviveram. Se você sabe, você sabe. Histórias épicas, confissões e muito respeito pela Tata.', 'Diversão', av2('Tata RH', '#f97316'), 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=60', 'OTG HQ', false, pedro.id),
    comm('bya-vestida-de-homem-aranha', 'Bya Vestida de Homem-Aranha', 'Aquele dia inesquecível em que a Beatriz apareceu na festa fantasiada de Homem-Aranha. A comunidade que preserva essa memória histórica pra sempre.', 'Diversão', av2('Bya Spider', '#dc2626'), 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=60', 'OTG HQ', false, fernanda.id),
    comm('dj-samuka', 'DJ Samuka', 'O Samuel do financeiro que também é DJ nos finais de semana. Playlist recommendations, análises financeiras com trilha sonora e o crossover que ninguém pediu mas todos amam.', 'Música', av2('DJ Samuka', '#7c3aed'), 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=60', 'Brasil', false, rodrigo.id),
  ]);
  console.log('✅ 12 comunidades criadas.');

  // ─── Community Members ────────────────────────────────────────────────────
  const addMember = (communityId: string, userId: string, role: CommunityMemberRole = CommunityMemberRole.MEMBER) =>
    prisma.communityMember.upsert({
      where: { communityId_userId: { communityId, userId } },
      update: { role },
      create: { communityId, userId, role },
    });

  await Promise.all([
    // Devs OTG - oficial, owner=raphael
    addMember(cDevs.id, raphael.id, CommunityMemberRole.OWNER),
    addMember(cDevs.id, lucas.id, CommunityMemberRole.MODERATOR),
    addMember(cDevs.id, carlos.id, CommunityMemberRole.MODERATOR),
    addMember(cDevs.id, mateus.id), addMember(cDevs.id, gabriel.id),
    addMember(cDevs.id, gustavo.id), addMember(cDevs.id, ana.id),
    addMember(cDevs.id, mariana.id), addMember(cDevs.id, larissa.id),

    // Café e Código - owner=lucas
    addMember(cCafe.id, lucas.id, CommunityMemberRole.OWNER),
    addMember(cCafe.id, mateus.id, CommunityMemberRole.MODERATOR),
    addMember(cCafe.id, carlos.id), addMember(cCafe.id, gabriel.id),
    addMember(cCafe.id, gustavo.id), addMember(cCafe.id, raphael.id),
    addMember(cCafe.id, ana.id), addMember(cCafe.id, fernanda.id),
    addMember(cCafe.id, pedro.id), addMember(cCafe.id, rodrigo.id),
    addMember(cCafe.id, amanda.id), addMember(cCafe.id, thiago.id),
    addMember(cCafe.id, mariana.id), addMember(cCafe.id, larissa.id),
    addMember(cCafe.id, isabela.id),

    // Deploy sem Medo - owner=carlos
    addMember(cDeploy.id, carlos.id, CommunityMemberRole.OWNER),
    addMember(cDeploy.id, lucas.id, CommunityMemberRole.MODERATOR),
    addMember(cDeploy.id, mateus.id), addMember(cDeploy.id, gabriel.id),
    addMember(cDeploy.id, gustavo.id), addMember(cDeploy.id, raphael.id),
    addMember(cDeploy.id, thiago.id), addMember(cDeploy.id, rodrigo.id),

    // Frontend Lovers - owner=mateus
    addMember(cFrontend.id, mateus.id, CommunityMemberRole.OWNER),
    addMember(cFrontend.id, gustavo.id, CommunityMemberRole.MODERATOR),
    addMember(cFrontend.id, lucas.id), addMember(cFrontend.id, carlos.id),
    addMember(cFrontend.id, gabriel.id), addMember(cFrontend.id, mariana.id),
    addMember(cFrontend.id, larissa.id), addMember(cFrontend.id, ana.id),

    // Cultura OTG - oficial, owner=camila
    addMember(cCultura.id, camila.id, CommunityMemberRole.OWNER),
    addMember(cCultura.id, beatriz.id, CommunityMemberRole.MODERATOR),
    addMember(cCultura.id, isabela.id, CommunityMemberRole.MODERATOR),
    addMember(cCultura.id, raphael.id), addMember(cCultura.id, ana.id),
    addMember(cCultura.id, fernanda.id), addMember(cCultura.id, juliana.id),
    addMember(cCultura.id, pedro.id), addMember(cCultura.id, amanda.id),
    addMember(cCultura.id, thiago.id), addMember(cCultura.id, lucas.id),
    addMember(cCultura.id, carlos.id), addMember(cCultura.id, mariana.id),
    addMember(cCultura.id, larissa.id), addMember(cCultura.id, rodrigo.id),

    // Galácticos - oficial, owner=beatriz
    addMember(cGalacticos.id, beatriz.id, CommunityMemberRole.OWNER),
    addMember(cGalacticos.id, camila.id, CommunityMemberRole.MODERATOR),
    addMember(cGalacticos.id, raphael.id), addMember(cGalacticos.id, ana.id),
    addMember(cGalacticos.id, gabriel.id), addMember(cGalacticos.id, lucas.id),
    addMember(cGalacticos.id, carlos.id), addMember(cGalacticos.id, amanda.id),

    // Memes - owner=gabriel
    addMember(cMemes.id, gabriel.id, CommunityMemberRole.OWNER),
    addMember(cMemes.id, mateus.id, CommunityMemberRole.MODERATOR),
    addMember(cMemes.id, lucas.id), addMember(cMemes.id, carlos.id),
    addMember(cMemes.id, ana.id), addMember(cMemes.id, fernanda.id),
    addMember(cMemes.id, thiago.id), addMember(cMemes.id, gustavo.id),
    addMember(cMemes.id, raphael.id), addMember(cMemes.id, mariana.id),
    addMember(cMemes.id, larissa.id), addMember(cMemes.id, rodrigo.id),
    addMember(cMemes.id, amanda.id), addMember(cMemes.id, juliana.id),

    // Produto - owner=ana
    addMember(cProduto.id, ana.id, CommunityMemberRole.OWNER),
    addMember(cProduto.id, larissa.id, CommunityMemberRole.MODERATOR),
    addMember(cProduto.id, mariana.id, CommunityMemberRole.MODERATOR),
    addMember(cProduto.id, raphael.id), addMember(cProduto.id, lucas.id),
    addMember(cProduto.id, carlos.id), addMember(cProduto.id, gustavo.id),

    // Vida Saudável - owner=isabela
    addMember(cVida.id, isabela.id, CommunityMemberRole.OWNER),
    addMember(cVida.id, camila.id, CommunityMemberRole.MODERATOR),
    addMember(cVida.id, beatriz.id), addMember(cVida.id, fernanda.id),
    addMember(cVida.id, juliana.id), addMember(cVida.id, ana.id),
    addMember(cVida.id, larissa.id), addMember(cVida.id, mariana.id),
    addMember(cVida.id, amanda.id),

    // Eu Conheço a Tata - owner=pedro
    addMember(cTata.id, pedro.id, CommunityMemberRole.OWNER),
    addMember(cTata.id, thiago.id, CommunityMemberRole.MODERATOR),
    addMember(cTata.id, amanda.id), addMember(cTata.id, rodrigo.id),
    addMember(cTata.id, patricia.id), addMember(cTata.id, fernanda.id),
    addMember(cTata.id, juliana.id), addMember(cTata.id, felipe.id),
    addMember(cTata.id, isabela.id), addMember(cTata.id, lucas.id),
    addMember(cTata.id, mateus.id), addMember(cTata.id, gustavo.id),

    // Bya Homem-Aranha - owner=fernanda
    addMember(cBya.id, fernanda.id, CommunityMemberRole.OWNER),
    addMember(cBya.id, juliana.id, CommunityMemberRole.MODERATOR),
    addMember(cBya.id, felipe.id), addMember(cBya.id, pedro.id),
    addMember(cBya.id, thiago.id), addMember(cBya.id, amanda.id),
    addMember(cBya.id, camila.id), addMember(cBya.id, isabela.id),
    addMember(cBya.id, ana.id), addMember(cBya.id, lucas.id),
    addMember(cBya.id, carlos.id), addMember(cBya.id, raphael.id),
    addMember(cBya.id, mariana.id), addMember(cBya.id, larissa.id),

    // DJ Samuka - owner=rodrigo
    addMember(cSamuka.id, rodrigo.id, CommunityMemberRole.OWNER),
    addMember(cSamuka.id, patricia.id, CommunityMemberRole.MODERATOR),
    addMember(cSamuka.id, mateus.id), addMember(cSamuka.id, gabriel.id),
    addMember(cSamuka.id, gustavo.id), addMember(cSamuka.id, felipe.id),
    addMember(cSamuka.id, juliana.id), addMember(cSamuka.id, fernanda.id),
  ]);
  console.log('✅ Membros distribuídos nas comunidades.');

  // ─── Community Posts ──────────────────────────────────────────────────────
  const mkPost = (communityId: string, authorId: string, title: string, content: string, daysBack: number) =>
    prisma.communityPost.create({
      data: { communityId, authorId, title, content, status: 'ACTIVE', createdAt: daysAgo(daysBack) },
    });

  const [
    p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
    p11, p12, p13, p14, p15, p16, p17, p18, p19, p20,
    p21, p22, p23, p24, p25,
  ] = await Promise.all([
    // Devs OTG
    mkPost(cDevs.id, raphael.id, '🚀 Code review: boas práticas que adotamos em 2026', 'Gente, juntei as melhores práticas de code review que o time Devs OTG consolidou esse ano. PR pequeno com descrição clara, teste na branch antes de pedir review, e sempre agradecer quem revisou. O que vocês acham? Tem algo que faltou?', 2),
    mkPost(cDevs.id, lucas.id, '🐛 Bug mais bizarro da história: await dentro de forEach', 'Perdi 3 horas num bug que parecia impossível. O forEach não é async! Chamava uma função async dentro do forEach e a promise simplesmente era ignorada. Solução: Promise.all com map. Compartilhem os bugs mais absurdos que já encontraram!', 5),
    mkPost(cDevs.id, carlos.id, 'Arquitetura de microsserviços: quando vale a pena?', 'Depois de migrar dois projetos pra microsserviços e me arrepender de um deles, quero compartilhar minha visão. Se seu time tem menos de 5 devs ou o sistema é novo: MONOLITO. Microsserviços é problema de escala, não de elegância. Debate aberto!', 10),

    // Café e Código
    mkPost(cCafe.id, lucas.id, '☕ Só entra quem já tomou café antes da daily', 'Regra número 1 desta comunidade. Não existe participação de qualidade em uma daily sem pelo menos uma xícara. Dois, três para tópicos difíceis. Compartilha aí: qual o seu ritual de café pré-trabalho?', 1),
    mkPost(cCafe.id, mateus.id, 'Melhores cafeterias para trabalhar em SP', 'Testei umas 20 cafeterias ao longo dos últimos meses e criei um ranking pessoal. Critérios: wifi, tomadas, nível de barulho e obviamente o café. Qual a sua favorita?', 8),
    mkPost(cCafe.id, carlos.id, '🧠 O melhor código que escrevi foi depois do terceiro espresso', 'Sério, tinha uma complexidade de O(n²) que eu não conseguia enxergar a solução. Aí fui tomar um café, voltei e em 15 minutos refatorei pra O(n log n). Cafeína é suplemento cognitivo não reconhecido pela ciência.', 14),

    // Deploy sem Medo
    mkPost(cDeploy.id, carlos.id, '🚨 Relato: deploy em sexta às 17h58', 'Vou confessar algo. Fiz um hotfix de emergência na sexta antes de um feriado. Deploy às 17h58. Monitorei o fim de semana todo do celular. Deu certo, mas nunca mais. Quem tem histórias similares?', 3),
    mkPost(cDeploy.id, gabriel.id, 'Como sobrevivemos ao maior incidente da história da OTG', 'O banco de dados de produção ficou fora por 4 horas. Documentei tudo: o que deu errado, como descobrimos, como resolvemos, o que mudamos depois. Leitura obrigatória pra qualquer dev.', 12),
    mkPost(cDeploy.id, gustavo.id, 'Feature flags salvam vidas: como implementamos aqui', 'Depois do incidente do trimestre passado, adotamos feature flags em tudo. Nenhum deploy vai pra 100% dos usuários sem passar por canary release. Aqui está como configuramos.', 20),

    // Frontend Lovers
    mkPost(cFrontend.id, mateus.id, '💅 CSS Grid vs Flexbox: pare de brigar, use os dois', 'A galera ainda trata como either/or mas são ferramentas diferentes. Grid pra layout bidimensional, Flex pra linear. Neste post mostro casos reais de quando usar cada um.', 4),
    mkPost(cFrontend.id, gustavo.id, 'React 19 na prática: o que mudou no nosso projeto', 'Migramos dois módulos pra React 19 essa sprint. As novidades de Actions e Server Components estão maduras. Aqui está o que fizemos, o que foi tranquilo e o que foi doloroso.', 9),
    mkPost(cFrontend.id, lucas.id, 'Acessibilidade não é feature, é requisito básico', 'Fiz um audit de acessibilidade no nosso app e o resultado foi... constrangedor. Compartilhando o que corrigimos e o checklist que criei pra não mais esquecer.', 16),

    // Cultura OTG
    mkPost(cCultura.id, camila.id, '💛 Valores OTG: um por um, o que significa na prática', 'Cada valor da empresa tem uma história real por trás. Resolvi documentar exemplos concretos de cada um que vivi aqui. Porque valor não é pôster na parede, é ação.', 3),
    mkPost(cCultura.id, isabela.id, 'O ritual do café com o CEO: experiência de quem participou', 'Fui numa das sessões de café com o CEO semana passada e foi revelador. Sem agenda, sem slides, só conversa. Compartilho os aprendizados e insights que tirei da sessão.', 11),
    mkPost(cCultura.id, beatriz.id, '🎉 Como celebramos conquistas aqui na OTG', 'Celebrar é parte da cultura. Mas como fazemos isso de forma autêntica e não forçada? Documentando nossos rituais de celebração que nasceram organicamente do time.', 18),

    // Memes
    mkPost(cMemes.id, gabriel.id, '😂 Quando o cliente muda os requisitos no dia da entrega', 'Essa semana aconteceu de novo. Tenho uma coleção de memes que descreve perfeitamente essa situação universal. Adicionem os seus nos comentários!', 2),
    mkPost(cMemes.id, lucas.id, 'Thread de memes: reunião que poderia ser e-mail', 'Compilei os melhores memes sobre a reunião desnecessária. É humor, mas também é catarse coletiva. Manda o seu favorito!', 6),

    // Produto
    mkPost(cProduto.id, ana.id, '🔍 Como fizemos discovery com 30 usuários em 2 semanas', 'Compartilhando o método que usamos na última sprint de discovery. Jobs To Be Done + entrevistas qualitativas + análise de comportamento. O roteiro completo está aqui.', 5),
    mkPost(cProduto.id, larissa.id, 'Framework de priorização que realmente funciona', 'Testei ICE, RICE, e criamos um híbrido. O critério mais importante que adicionamos: impacto no cliente imediato. Explico tudo com exemplos reais do nosso backlog.', 13),

    // Vida Saudável
    mkPost(cVida.id, isabela.id, '🌱 30 dias sem doom scrolling: relato honesto', 'Fiz a experiência. As primeiras duas semanas foram difíceis. Depois de 30 dias: dormi melhor, produzi mais e fui mais presente nas conversas. Compartilho o passo a passo.', 7),
    mkPost(cVida.id, camila.id, 'Pausa de 5 minutos a cada hora: como implementei no trabalho', 'Técnica Pomodoro adaptada. Além de produtividade, observei melhora na postura e menos dor de cabeça. Comparto a rotina exata que criei.', 15),

    // Eu Conheço a Tata
    mkPost(cTata.id, pedro.id, '👩‍💼 A primeira vez que fui chamado na sala da Tata', 'Tinha 3 meses de empresa. Recebi aquele "pode vir aqui um segundo?" no Teams. Entrei pensando que ia embora. Saí com um aumento. O que aprendi sobre não assumir o pior.', 4),
    mkPost(cTata.id, thiago.id, 'Quem já foi convocado pra conversa de feedback às 15h numa sexta?', 'Esse era o medo número 1 de todo mundo. Compartilhem suas histórias de sexta às 15h com RH. As minhas acabaram sempre bem, mas o coração dispara igual.', 10),

    // Bya Homem-Aranha
    mkPost(cBya.id, fernanda.id, '🕷️ O dia que a Bya virou lenda da OTG', 'Conta a lenda que era a festa de Halloween da empresa. Beatriz apareceu com o traje completo do Homem-Aranha e passou o dia inteiro de terno-aranha nas reuniões. Esse dia mudou a cultura da OTG.', 1),

    // DJ Samuka
    mkPost(cSamuka.id, rodrigo.id, '🎧 Playlist para fechar o mês: bpm que combina com deadline', 'Quando é véspera de fechamento, não dá pra ouvir música lenta. Aqui está minha playlist de alta energia pro sprint final. BPM calibrado pra produtividade máxima.', 3),
  ]);
  console.log('✅ Posts das comunidades criados.');

  // ─── Community Comments ───────────────────────────────────────────────────
  await Promise.all([
    prisma.communityPostComment.create({ data: { postId: p1.id, authorId: lucas.id, content: 'Concordo 100%! Adicionaria: nunca faça review depois das 18h, o cérebro já foi 😅' } }),
    prisma.communityPostComment.create({ data: { postId: p1.id, authorId: carlos.id, content: 'PR pequeno é lei. Qualquer coisa acima de 400 linhas eu já mando de volta pro autor.' } }),
    prisma.communityPostComment.create({ data: { postId: p1.id, authorId: gabriel.id, content: 'Perfeito. Tem que adicionar na description o "por que" da mudança, não só o "o que".' } }),
    prisma.communityPostComment.create({ data: { postId: p2.id, authorId: mateus.id, content: 'Clássico! Já passei exatamente por isso. Agora tenho um lint que proíbe async inside forEach hahaha' } }),
    prisma.communityPostComment.create({ data: { postId: p2.id, authorId: carlos.id, content: 'O mais bizarro que vi foi uma promise sendo swallowed dentro de um try-catch errado. 2 dias de debug.' } }),
    prisma.communityPostComment.create({ data: { postId: p3.id, authorId: lucas.id, content: 'Essa filosofia de monolito primeiro me salvou semanas de trabalho desnecessário no projeto anterior.' } }),
    prisma.communityPostComment.create({ data: { postId: p4.id, authorId: carlos.id, content: 'Regra sagrada. Quem chega na daily sem café não tem direito a voto.' } }),
    prisma.communityPostComment.create({ data: { postId: p4.id, authorId: mateus.id, content: 'Posso adicionar: duas xícaras para sprint planning, três para retrospectiva difícil.' } }),
    prisma.communityPostComment.create({ data: { postId: p4.id, authorId: gabriel.id, content: 'A daily de segunda exige um nível extra de cafeína que a ciência ainda não documentou.' } }),
    prisma.communityPostComment.create({ data: { postId: p7.id, authorId: lucas.id, content: 'Herói ou vilão? As duas coisas. Mas principalmente herói por tudo ter dado certo.' } }),
    prisma.communityPostComment.create({ data: { postId: p7.id, authorId: mateus.id, content: 'Eu nunca faço deploy em sexta. Mas respeito demais quem tem coragem.' } }),
    prisma.communityPostComment.create({ data: { postId: p7.id, authorId: gabriel.id, content: 'Próxima vez: feature flag. Você salva a si mesmo de uma final boss sexta.' } }),
    prisma.communityPostComment.create({ data: { postId: p8.id, authorId: carlos.id, content: 'Esse post deveria ser treinamento obrigatório pra todo dev novo. Documentação impecável.' } }),
    prisma.communityPostComment.create({ data: { postId: p8.id, authorId: mateus.id, content: 'O runbook que criamos depois disso é o melhor artefato técnico que temos hoje.' } }),
    prisma.communityPostComment.create({ data: { postId: p10.id, authorId: gustavo.id, content: 'Finalmente alguém diz isso! Cansei de ver projeto começar com flexbox onde claramente era pra usar grid.' } }),
    prisma.communityPostComment.create({ data: { postId: p13.id, authorId: beatriz.id, content: 'Esse post vai pra wiki de onboarding imediatamente. Obrigada Camila!' } }),
    prisma.communityPostComment.create({ data: { postId: p13.id, authorId: isabela.id, content: 'Vivo esses valores todo dia. Ler assim de forma estruturada deu um novo significado.' } }),
    prisma.communityPostComment.create({ data: { postId: p16.id, authorId: mateus.id, content: 'Esse meme vai pro grupo de família 😂' } }),
    prisma.communityPostComment.create({ data: { postId: p16.id, authorId: carlos.id, content: '"só uma coisinha pequena" é a frase mais perigosa do universo do desenvolvimento.' } }),
    prisma.communityPostComment.create({ data: { postId: p18.id, authorId: mariana.id, content: 'O framework de entrevistas que você compartilhou mudou completamente como fazemos discovery aqui.' } }),
    prisma.communityPostComment.create({ data: { postId: p18.id, authorId: larissa.id, content: 'Jobs to be Done é o melhor framework que já usei. Obrigada por documentar assim!' } }),
    prisma.communityPostComment.create({ data: { postId: p22.id, authorId: thiago.id, content: 'Saí suando frio de uma dessas uma vez. Mas era só pro café com o CEO hahaha' } }),
    prisma.communityPostComment.create({ data: { postId: p22.id, authorId: amanda.id, content: 'A Tata tem uma energia muito especial. Nunca fui pra uma reunião dela e saí mal.' } }),
    prisma.communityPostComment.create({ data: { postId: p24.id, authorId: camila.id, content: 'Esse dia foi histórico. A Bya literalmente fez apresentação pra diretoria com a máscara do Homem-Aranha.' } }),
    prisma.communityPostComment.create({ data: { postId: p24.id, authorId: ana.id, content: 'Eu estava lá. Nunca esquecerei. Aquilo quebrou o protocolo corporativo de um jeito maravilhoso.' } }),
    prisma.communityPostComment.create({ data: { postId: p24.id, authorId: lucas.id, content: 'A Bya subiu de cargo na semana seguinte. Correlação ou causalidade?' } }),
    prisma.communityPostComment.create({ data: { postId: p25.id, authorId: gabriel.id, content: 'DJ Samuka com playlist de fechamento é suplemento de produtividade certificado.' } }),
    prisma.communityPostComment.create({ data: { postId: p25.id, authorId: mateus.id, content: 'Coloca no Spotify por favor. Preciso disso toda sexta de deadline.' } }),
  ]);
  console.log('✅ Comentários das comunidades criados.');

  // ─── Community Reactions ──────────────────────────────────────────────────
  const communityReactions: Array<{ postId: string; userId: string; reactionType: ReactionType }> = [
    { postId: p1.id, userId: mateus.id, reactionType: 'CLAP' },
    { postId: p1.id, userId: gabriel.id, reactionType: 'FIRE' },
    { postId: p1.id, userId: ana.id, reactionType: 'CLAP' },
    { postId: p2.id, userId: carlos.id, reactionType: 'BRAIN' },
    { postId: p2.id, userId: mateus.id, reactionType: 'BRAIN' },
    { postId: p2.id, userId: gustavo.id, reactionType: 'HEART' },
    { postId: p3.id, userId: lucas.id, reactionType: 'FIRE' },
    { postId: p3.id, userId: mateus.id, reactionType: 'CLAP' },
    { postId: p4.id, userId: carlos.id, reactionType: 'HEART' },
    { postId: p4.id, userId: mateus.id, reactionType: 'CLAP' },
    { postId: p4.id, userId: gabriel.id, reactionType: 'HEART' },
    { postId: p4.id, userId: raphael.id, reactionType: 'CLAP' },
    { postId: p7.id, userId: mateus.id, reactionType: 'ROCKET' },
    { postId: p7.id, userId: gabriel.id, reactionType: 'FIRE' },
    { postId: p7.id, userId: gustavo.id, reactionType: 'HEART' },
    { postId: p8.id, userId: carlos.id, reactionType: 'CLAP' },
    { postId: p8.id, userId: lucas.id, reactionType: 'BRAIN' },
    { postId: p8.id, userId: raphael.id, reactionType: 'ROCKET' },
    { postId: p13.id, userId: beatriz.id, reactionType: 'HEART' },
    { postId: p13.id, userId: isabela.id, reactionType: 'HEART' },
    { postId: p13.id, userId: ana.id, reactionType: 'CLAP' },
    { postId: p13.id, userId: fernanda.id, reactionType: 'HEART' },
    { postId: p16.id, userId: mateus.id, reactionType: 'FIRE' },
    { postId: p16.id, userId: carlos.id, reactionType: 'BRAIN' },
    { postId: p16.id, userId: ana.id, reactionType: 'CLAP' },
    { postId: p18.id, userId: larissa.id, reactionType: 'ROCKET' },
    { postId: p18.id, userId: mariana.id, reactionType: 'BRAIN' },
    { postId: p18.id, userId: carlos.id, reactionType: 'CLAP' },
    { postId: p22.id, userId: thiago.id, reactionType: 'HEART' },
    { postId: p22.id, userId: amanda.id, reactionType: 'CLAP' },
    { postId: p24.id, userId: camila.id, reactionType: 'FIRE' },
    { postId: p24.id, userId: ana.id, reactionType: 'HEART' },
    { postId: p24.id, userId: lucas.id, reactionType: 'ROCKET' },
    { postId: p24.id, userId: carlos.id, reactionType: 'CLAP' },
    { postId: p24.id, userId: raphael.id, reactionType: 'HEART' },
    { postId: p25.id, userId: gabriel.id, reactionType: 'ROCKET' },
    { postId: p25.id, userId: mateus.id, reactionType: 'FIRE' },
  ];

  await prisma.communityPostReaction.createMany({ data: communityReactions, skipDuplicates: true });
  console.log(`✅ ${communityReactions.length} reações nas comunidades criadas.`);

  console.log('\n🎉 Seed Fase 3 completo! Gamificação ativa.');
  console.log(`   Admin: raphaelbraga@grupootg.com`);
}

main()
  .catch((error) => {
    console.error('❌ Seed falhou:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
