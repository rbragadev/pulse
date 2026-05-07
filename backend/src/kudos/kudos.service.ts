import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { KudosPostStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { KudosRepository } from './kudos.repository';
import { AchievementsService } from '../achievements/achievements.service';
import { CreateKudosDto } from './dto/create-kudos.dto';
import { KudosQueryDto } from './dto/kudos-query.dto';

@Injectable()
export class KudosService {
  constructor(
    private readonly kudosRepository: KudosRepository,
    private readonly prisma: PrismaService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async getFeed(userId: string, query: KudosQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);

    const [posts, total] = await Promise.all([
      this.kudosRepository.findFeed(userId, { skip, take: limit, where }),
      this.kudosRepository.count(where),
    ]);

    return { posts, total, page, limit };
  }

  async findAll(query: KudosQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);

    const [posts, total] = await Promise.all([
      this.kudosRepository.findMany({ skip, take: limit, where }),
      this.kudosRepository.count(where),
    ]);

    return { posts, total, page, limit };
  }

  private buildWhere(query: KudosQueryDto) {
    const where: Record<string, unknown> = { status: KudosPostStatus.ACTIVE };
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.recipientId) where.recipientId = query.recipientId;
    if (query.authorId) where.authorId = query.authorId;
    return where;
  }

  async create(authorId: string, dto: CreateKudosDto) {
    if (authorId === dto.recipientId) {
      throw new BadRequestException('Você não pode enviar kudos para si mesmo');
    }

    const [author, recipient, category] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: authorId } }),
      this.prisma.user.findUnique({ where: { id: dto.recipientId } }),
      this.kudosRepository.findCategoryById(dto.categoryId),
    ]);

    if (!author?.isActive) throw new ForbiddenException('Sua conta está inativa');
    if (!recipient) throw new NotFoundException('Colaborador não encontrado');
    if (!recipient.isActive) throw new BadRequestException('Colaborador não está ativo');
    if (!category) throw new NotFoundException('Categoria não encontrada');
    if (!category.isActive) throw new BadRequestException('Categoria não está ativa');

    await this.enforcePointRule(authorId, dto.recipientId, dto.categoryId);

    const post = await this.kudosRepository.create({
      message: dto.message,
      author: { connect: { id: authorId } },
      recipient: { connect: { id: dto.recipientId } },
      category: { connect: { id: dto.categoryId } },
    });

    // ── Achievements (non-blocking) ────────────────────────────────────────────
    Promise.all([
      this.achievementsService.checkAndGrantAchievements(authorId),
      this.achievementsService.checkAndGrantAchievements(dto.recipientId),
    ]).catch(() => {});
    // ──────────────────────────────────────────────────────────────────────────

    return post;
  }

  async addLike(userId: string, postId: string) {
    const post = await this.kudosRepository.findById(postId);
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.kudosRepository.findLike(userId, postId);
    if (existing) return { liked: true };

    await this.kudosRepository.createLike(userId, postId);
    return { liked: true };
  }

  async removeLike(userId: string, postId: string) {
    const post = await this.kudosRepository.findById(postId);
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.kudosRepository.findLike(userId, postId);
    if (!existing) return { liked: false };

    await this.kudosRepository.deleteLike(userId, postId);
    return { liked: false };
  }

  // ─── PointRule helpers ──────────────────────────────────────────────────────

  private async enforcePointRule(authorId: string, recipientId: string, categoryId: string) {
    const rule = await this.prisma.pointRule.findUnique({ where: { categoryId } });
    if (!rule) return;
    await Promise.all([
      this.enforceWeeklyLimit(authorId, categoryId, rule.weeklyLimit),
      this.enforceCooldown(authorId, recipientId, categoryId, rule.cooldownHours),
    ]);
  }

  private async enforceWeeklyLimit(authorId: string, categoryId: string, limit: number) {
    if (limit <= 0) return;
    const now = new Date();
    const daysFromMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const count = await this.prisma.kudosPost.count({
      where: { authorId, categoryId, createdAt: { gte: startOfWeek }, status: { not: KudosPostStatus.REMOVED } },
    });
    if (count >= limit) {
      throw new BadRequestException(`Limite semanal atingido para esta categoria (${limit} por semana)`);
    }
  }

  private async enforceCooldown(
    authorId: string,
    recipientId: string,
    categoryId: string,
    cooldownHours: number,
  ) {
    if (cooldownHours <= 0) return;
    const since = new Date(Date.now() - cooldownHours * 60 * 60 * 1000);
    const recent = await this.prisma.kudosPost.findFirst({
      where: { authorId, recipientId, categoryId, createdAt: { gte: since }, status: { not: KudosPostStatus.REMOVED } },
    });
    if (recent) {
      throw new BadRequestException(
        `Você já enviou um kudos nesta categoria para este colaborador. Aguarde ${cooldownHours}h antes de repetir.`,
      );
    }
  }

  findCategories() {
    return this.kudosRepository.findCategories();
  }

  createCategory(data: { name: string; description?: string; icon?: string; color?: string }) {
    return this.kudosRepository.createCategory(data);
  }

  deleteCategory(id: string) {
    return this.kudosRepository.deleteCategory(id);
  }

  // ─── Reactions ──────────────────────────────────────────────────────────────

  async toggleReaction(userId: string, postId: string, reactionType: string) {
    const post = await this.kudosRepository.findById(postId);
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.prisma.kudosReaction.findUnique({
      where: { userId_postId_reactionType: { userId, postId, reactionType: reactionType as any } },
    });

    if (existing) {
      await this.prisma.kudosReaction.delete({ where: { id: existing.id } });
      return { reacted: false, reactionType };
    }

    await this.prisma.kudosReaction.create({ data: { userId, postId, reactionType: reactionType as any } });
    return { reacted: true, reactionType };
  }

  async getReactions(postId: string, userId?: string) {
    const reactions = await this.prisma.kudosReaction.groupBy({
      by: ['reactionType'],
      where: { postId },
      _count: { id: true },
    });

    let myReactions: string[] = [];
    if (userId) {
      const mine = await this.prisma.kudosReaction.findMany({ where: { postId, userId } });
      myReactions = mine.map((r) => r.reactionType);
    }

    return {
      reactions: reactions.map((r) => ({ type: r.reactionType, count: r._count.id })),
      myReactions,
    };
  }

  // ─── Comments ───────────────────────────────────────────────────────────────

  async getComments(postId: string) {
    return this.prisma.kudosComment.findMany({
      where: { postId },
      include: { author: { select: { id: true, name: true, avatar: true, department: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addComment(authorId: string, postId: string, message: string) {
    const post = await this.kudosRepository.findById(postId);
    if (!post) throw new NotFoundException('Post não encontrado');
    return this.prisma.kudosComment.create({
      data: { authorId, postId, message },
      include: { author: { select: { id: true, name: true, avatar: true, department: true } } },
    });
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.kudosComment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comentário não encontrado');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (comment.authorId !== userId && user?.role !== 'ADMIN') {
      throw new ForbiddenException('Você não pode deletar este comentário');
    }

    return this.prisma.kudosComment.delete({ where: { id: commentId } });
  }
}
