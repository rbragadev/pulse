import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeasonsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.season.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        rankings: {
          include: { user: { include: { department: true } } },
          orderBy: { position: 'asc' },
          take: 10,
        },
      },
    });
  }

  findActive() {
    return this.prisma.season.findFirst({
      where: { active: true },
      include: {
        rankings: {
          include: { user: { include: { department: true } } },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async getHallOfFame() {
    const seasons = await this.prisma.season.findMany({
      where: { active: false },
      orderBy: { startDate: 'desc' },
      include: {
        rankings: {
          where: { position: { lte: 3 } },
          include: { user: { include: { department: true } } },
          orderBy: { position: 'asc' },
        },
      },
    });

    const topAllTime = await this.prisma.kudosPost.groupBy({
      by: ['recipientId'],
      where: { status: 'ACTIVE' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const allTimeUsers = await Promise.all(
      topAllTime.map(async (entry, idx) => {
        const user = await this.prisma.user.findUnique({
          where: { id: entry.recipientId },
          include: { department: true },
        });
        return { position: idx + 1, user, totalKudos: entry._count.id };
      }),
    );

    return { seasons, allTime: allTimeUsers };
  }

  async snapshotActiveSeason() {
    const season = await this.prisma.season.findFirst({ where: { active: true } });
    if (!season) return null;

    const startOfMonth = new Date(season.startDate);
    const rankings = await this.prisma.kudosPost.groupBy({
      by: ['recipientId'],
      where: { status: 'ACTIVE', createdAt: { gte: startOfMonth } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    });

    await Promise.all(
      rankings.map((entry, idx) =>
        this.prisma.seasonRanking.upsert({
          where: { seasonId_userId: { seasonId: season.id, userId: entry.recipientId } },
          update: { position: idx + 1, points: entry._count.id },
          create: { seasonId: season.id, userId: entry.recipientId, position: idx + 1, points: entry._count.id },
        }),
      ),
    );

    return rankings;
  }
}
