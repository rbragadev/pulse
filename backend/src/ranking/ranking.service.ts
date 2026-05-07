import { Injectable } from '@nestjs/common';
import { KudosPostStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface RankingRow {
  recipient_id: string;
  total_points: bigint;
}

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  async getGalacticosRanking(year?: number, month?: number) {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? now.getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    const rows = await this.prisma.$queryRaw<RankingRow[]>`
      SELECT kp."recipientId" AS recipient_id, SUM(kc."weight") AS total_points
      FROM kudos_posts kp
      JOIN kudos_categories kc ON kc.id = kp."categoryId"
      WHERE kp.status = ${KudosPostStatus.ACTIVE}::"KudosPostStatus"
        AND kp."createdAt" >= ${startDate}
        AND kp."createdAt" <= ${endDate}
      GROUP BY kp."recipientId"
      ORDER BY total_points DESC
      LIMIT 10
    `;

    const items = await Promise.all(
      rows.map(async (row, index) => {
        const user = await this.prisma.user.findUnique({
          where: { id: row.recipient_id },
          include: { department: true },
        });
        return {
          position: index + 1,
          userId: row.recipient_id,
          name: user?.name ?? '',
          avatarUrl: user?.avatar ?? null,
          department: user?.department?.name ?? null,
          kudosReceived: Number(row.total_points),
          user,
        };
      }),
    );

    return {
      period: { year: targetYear, month: targetMonth + 1 },
      ranking: items,
    };
  }

  async getMonthlyRanking(year?: number, month?: number) {
    return this.getGalacticosRanking(year, month);
  }

  async getAllTimeRanking() {
    const rows = await this.prisma.$queryRaw<RankingRow[]>`
      SELECT kp."recipientId" AS recipient_id, SUM(kc."weight") AS total_points
      FROM kudos_posts kp
      JOIN kudos_categories kc ON kc.id = kp."categoryId"
      WHERE kp.status = ${KudosPostStatus.ACTIVE}::"KudosPostStatus"
      GROUP BY kp."recipientId"
      ORDER BY total_points DESC
      LIMIT 10
    `;

    return Promise.all(
      rows.map(async (row, index) => {
        const user = await this.prisma.user.findUnique({
          where: { id: row.recipient_id },
          include: { department: true },
        });
        return {
          position: index + 1,
          userId: row.recipient_id,
          name: user?.name ?? '',
          avatarUrl: user?.avatar ?? null,
          department: user?.department?.name ?? null,
          kudosReceived: Number(row.total_points),
          user,
        };
      }),
    );
  }
}
