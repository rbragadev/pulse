import { Injectable, NotFoundException } from '@nestjs/common';
import { CommunityStatus, KudosPostStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CommunitiesRepository } from '../communities/communities.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly communitiesRepo: CommunitiesRepository,
  ) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  async getDashboard() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, activeUsers, totalKudos, kudosThisMonth] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.kudosPost.count({ where: { status: KudosPostStatus.ACTIVE } }),
      this.prisma.kudosPost.count({
        where: { status: KudosPostStatus.ACTIVE, createdAt: { gte: monthStart } },
      }),
    ]);

    const topCategoriesRaw = await this.prisma.kudosPost.groupBy({
      by: ['categoryId'],
      where: { status: KudosPostStatus.ACTIVE, createdAt: { gte: monthStart } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const topCategories = await Promise.all(
      topCategoriesRaw.map(async (c) => {
        const category = await this.prisma.kudosCategory.findUnique({ where: { id: c.categoryId } });
        return { category, count: c._count.id };
      }),
    );

    const topUsersRaw = await this.prisma.kudosPost.groupBy({
      by: ['recipientId'],
      where: { status: KudosPostStatus.ACTIVE, createdAt: { gte: monthStart } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const topUsers = await Promise.all(
      topUsersRaw.map(async (u) => {
        const user = await this.prisma.user.findUnique({
          where: { id: u.recipientId },
          include: { department: true },
        });
        return { user, kudosCount: u._count.id };
      }),
    );

    return { totalUsers, activeUsers, totalKudos, kudosThisMonth, topCategories, topUsers };
  }

  getDashboardStats() {
    return this.getDashboard();
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: { department: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total, page, limit };
  }

  async updateUser(
    id: string,
    data: { isActive?: boolean; role?: Role; departmentId?: string | null },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.prisma.user.update({ where: { id }, data, include: { department: true } });
  }

  updateUserRole(id: string, role: 'USER' | 'ADMIN') {
    return this.updateUser(id, { role: role as Role });
  }

  // ─── Categories ───────────────────────────────────────────────────────────

  getCategories() {
    return this.prisma.kudosCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } }, rule: true },
    });
  }

  createCategory(data: {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    weight?: number;
    isActive?: boolean;
  }) {
    return this.prisma.kudosCategory.create({ data });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      icon?: string;
      color?: string;
      weight?: number;
      isActive?: boolean;
    },
  ) {
    const cat = await this.prisma.kudosCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Categoria não encontrada');
    return this.prisma.kudosCategory.update({ where: { id }, data });
  }

  // ─── Kudos Moderation ─────────────────────────────────────────────────────

  async getKudos(page = 1, limit = 20, status?: KudosPostStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : undefined;
    const [posts, total] = await Promise.all([
      this.prisma.kudosPost.findMany({
        skip,
        take: limit,
        where,
        include: {
          author: { include: { department: true } },
          recipient: { include: { department: true } },
          category: true,
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.kudosPost.count({ where }),
    ]);
    return { posts, total, page, limit };
  }

  async updateKudosStatus(id: string, status: KudosPostStatus) {
    const post = await this.prisma.kudosPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post não encontrado');
    return this.prisma.kudosPost.update({ where: { id }, data: { status } });
  }

  // ─── Point Rules ──────────────────────────────────────────────────────────

  getRules() {
    return this.prisma.pointRule.findMany({
      include: { category: true },
      orderBy: { category: { name: 'asc' } },
    });
  }

  createRule(data: {
    categoryId: string;
    points: number;
    weeklyLimit: number;
    cooldownHours: number;
  }) {
    return this.prisma.pointRule.create({ data, include: { category: true } });
  }

  async updateRule(
    id: string,
    data: { points?: number; weeklyLimit?: number; cooldownHours?: number },
  ) {
    const rule = await this.prisma.pointRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException('Regra não encontrada');
    return this.prisma.pointRule.update({ where: { id }, data, include: { category: true } });
  }

  getPosts(page = 1, limit = 20) {
    return this.getKudos(page, limit);
  }

  // ─── Communities ──────────────────────────────────────────────────────────

  async getAdminCommunities(page = 1, limit = 20) {
    const [communities, total] = await this.communitiesRepo.findAllAdmin(page, limit);
    return { communities, total, page, limit };
  }

  createOfficialCommunity(data: {
    name: string;
    slug: string;
    description?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    category?: string;
    language?: string;
    location?: string;
    createdById: string;
  }) {
    return this.communitiesRepo.create({ ...data, isOfficial: true });
  }

  async updateCommunity(
    id: string,
    data: {
      name?: string;
      description?: string;
      avatarUrl?: string;
      bannerUrl?: string;
      category?: string;
      isOfficial?: boolean;
      status?: CommunityStatus;
    },
  ) {
    const community = await this.communitiesRepo.findById(id);
    if (!community) throw new NotFoundException('Comunidade não encontrada');
    return this.communitiesRepo.update(id, data);
  }

  getCommunityMembers(communityId: string) {
    return this.communitiesRepo.findCommunityMembers(communityId);
  }

  getCommunityPosts(communityId: string, page = 1, limit = 20) {
    return this.communitiesRepo.findCommunityPosts(communityId, page, limit);
  }

  moderateCommunityPost(postId: string, status: 'ACTIVE' | 'HIDDEN' | 'REMOVED') {
    return this.communitiesRepo.updatePostStatus(postId, status as any);
  }

  async setCommunityMemberRole(
    communityId: string,
    userId: string,
    role: 'MEMBER' | 'MODERATOR',
  ) {
    const membership = await this.communitiesRepo.findMembership(communityId, userId);
    if (!membership) throw new NotFoundException('Membro não encontrado na comunidade');
    return this.communitiesRepo.setMemberRole(communityId, userId, role);
  }
}
