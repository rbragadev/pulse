import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.achievement.findMany({ orderBy: { conditionValue: 'asc' } });
  }

  findUserAchievements(userId: string) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { completedAt: 'desc' },
    });
  }

  async checkAndGrantAchievements(userId: string) {
    const achievements = await this.prisma.achievement.findMany();
    const kudosReceived = await this.prisma.kudosPost.count({
      where: { recipientId: userId, status: 'ACTIVE' },
    });
    const kudosSent = await this.prisma.kudosPost.count({
      where: { authorId: userId, status: 'ACTIVE' },
    });
    const uniqueSenders = await this.prisma.kudosPost.findMany({
      where: { recipientId: userId, status: 'ACTIVE' },
      select: { authorId: true },
      distinct: ['authorId'],
    });
    const uniqueDepts = await this.prisma.kudosPost.findMany({
      where: { recipientId: userId, status: 'ACTIVE' },
      include: { author: { select: { departmentId: true } } },
    });
    const uniqueDeptCount = new Set(
      uniqueDepts.map((p) => p.author.departmentId).filter(Boolean),
    ).size;

    const metrics: Record<string, number> = {
      KUDOS_RECEIVED: kudosReceived,
      KUDOS_SENT: kudosSent,
      UNIQUE_SENDERS: uniqueSenders.length,
      UNIQUE_DEPARTMENTS: uniqueDeptCount,
    };

    for (const ach of achievements) {
      const progress = metrics[ach.type] ?? 0;
      const completed = progress >= ach.conditionValue;

      await this.prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId, achievementId: ach.id } },
        update: {
          progress,
          completed,
          completedAt: completed ? new Date() : undefined,
        },
        create: {
          userId,
          achievementId: ach.id,
          progress,
          completed,
          completedAt: completed ? new Date() : null,
        },
      });
    }
  }
}
