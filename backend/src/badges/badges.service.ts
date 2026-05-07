import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BadgeRarity } from '@prisma/client';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.badge.findMany({ orderBy: { rarity: 'asc' } });
  }

  findUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  async awardBadge(userId: string, badgeId: string) {
    return this.prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId } },
      update: {},
      create: { userId, badgeId },
      include: { badge: true },
    });
  }

  async revokeBadge(userId: string, badgeId: string) {
    return this.prisma.userBadge.deleteMany({ where: { userId, badgeId } });
  }

  create(data: { name: string; slug: string; description: string; icon: string; color: string; rarity: BadgeRarity }) {
    return this.prisma.badge.create({ data });
  }
}
