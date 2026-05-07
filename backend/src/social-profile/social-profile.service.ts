import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VoteType } from '@prisma/client';

@Injectable()
export class SocialProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getFullProfile(userId: string, requesterId?: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { department: true },
    });

    const [
      kudosReceivedCount,
      kudosSentCount,
      badges,
      achievements,
      votes,
      recentVisitors,
      topCategories,
      fans,
    ] = await Promise.all([
      this.prisma.kudosPost.count({ where: { recipientId: userId, status: 'ACTIVE' } }),
      this.prisma.kudosPost.count({ where: { authorId: userId, status: 'ACTIVE' } }),
      this.prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { unlockedAt: 'desc' },
      }),
      this.prisma.userAchievement.findMany({
        where: { userId, completed: true },
        include: { achievement: true },
        orderBy: { completedAt: 'desc' },
        take: 5,
      }),
      this.prisma.profileVote.groupBy({
        by: ['type'],
        where: { targetId: userId },
        _count: { id: true },
      }),
      this.prisma.profileVisit.findMany({
        where: { profileId: userId },
        include: { visitor: { select: { id: true, name: true, avatar: true, department: true } } },
        orderBy: { visitedAt: 'desc' },
        distinct: ['visitorId'],
        take: 8,
      }),
      this.prisma.kudosPost.groupBy({
        by: ['categoryId'],
        where: { recipientId: userId, status: 'ACTIVE' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      this.prisma.kudosPost.groupBy({
        by: ['authorId'],
        where: { recipientId: userId, status: 'ACTIVE' },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 6,
      }),
    ]);

    const categoryDetails = await Promise.all(
      topCategories.map(async (c) => ({
        category: await this.prisma.kudosCategory.findUnique({ where: { id: c.categoryId } }),
        count: c._count.id,
      })),
    );

    const fanDetails = await Promise.all(
      fans.map(async (f) => ({
        user: await this.prisma.user.findUnique({
          where: { id: f.authorId },
          select: { id: true, name: true, avatar: true },
        }),
        count: f._count.id,
      })),
    );

    const votesMap = votes.reduce(
      (acc, v) => ({ ...acc, [v.type]: v._count.id }),
      {} as Record<string, number>,
    );

    let myVotes: Record<string, boolean> = {};
    if (requesterId) {
      const existing = await this.prisma.profileVote.findMany({
        where: { voterId: requesterId, targetId: userId },
      });
      myVotes = existing.reduce(
        (acc, v) => ({ ...acc, [v.type]: true }),
        {} as Record<string, boolean>,
      );
    }

    return {
      user,
      stats: { kudosReceived: kudosReceivedCount, kudosSent: kudosSentCount },
      badges,
      achievements,
      votes: votesMap,
      myVotes,
      recentVisitors: recentVisitors.map((v) => ({ ...v.visitor, visitedAt: v.visitedAt })),
      topCategories: categoryDetails,
      fans: fanDetails,
    };
  }

  async vote(voterId: string, targetId: string, type: VoteType) {
    if (voterId === targetId) throw new ForbiddenException('Você não pode votar em si mesmo');

    const existing = await this.prisma.profileVote.findUnique({
      where: { voterId_targetId_type: { voterId, targetId, type } },
    });

    if (existing) {
      await this.prisma.profileVote.delete({ where: { id: existing.id } });
      return { voted: false, type };
    }

    await this.prisma.profileVote.create({ data: { voterId, targetId, type } });
    return { voted: true, type };
  }

  async recordVisit(visitorId: string, profileId: string) {
    if (visitorId === profileId) return;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent = await this.prisma.profileVisit.findFirst({
      where: { visitorId, profileId, visitedAt: { gte: since } },
    });
    if (recent) return;
    await this.prisma.profileVisit.create({ data: { visitorId, profileId } });
  }
}
