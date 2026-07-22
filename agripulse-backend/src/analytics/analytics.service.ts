import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /** F-ADM-06 — USSD sessions started per calendar day. */
  async sessionsPerDay(days: number) {
    const since = this.sinceDate(days);

    const rows = await this.prisma.$queryRaw<
      Array<{ date: Date; count: bigint }>
    >`
      SELECT DATE(started_at) AS date, COUNT(*)::bigint AS count
      FROM ussd_sessions
      WHERE started_at >= ${since}
      GROUP BY DATE(started_at)
      ORDER BY date ASC
    `;

    return rows.map((row) => ({
      date: this.toDateString(row.date),
      count: Number(row.count),
    }));
  }

  /** F-ADM-06 — most-queried crops from CropQueryLog (USSD price + AI). */
  async topCrops(days: number) {
    const since = this.sinceDate(days);

    const grouped = await this.prisma.cropQueryLog.groupBy({
      by: ['cropId'],
      where: { createdAt: { gte: since } },
      _count: { cropId: true },
      orderBy: { _count: { cropId: 'desc' } },
      take: 20,
    });

    if (grouped.length === 0) {
      return [];
    }

    const crops = await this.prisma.crop.findMany({
      where: { id: { in: grouped.map((g) => g.cropId) } },
      select: { id: true, name: true, nameRw: true },
    });
    const byId = new Map(crops.map((c) => [c.id, c]));

    return grouped.map((g) => ({
      cropId: g.cropId,
      name: byId.get(g.cropId)?.name ?? 'Unknown',
      nameRw: byId.get(g.cropId)?.nameRw ?? null,
      queryCount: g._count.cropId,
    }));
  }

  /** F-AI-07 / dashboard — prediction requests per day. */
  async predictionUsage(days: number) {
    const since = this.sinceDate(days);

    const rows = await this.prisma.$queryRaw<
      Array<{ date: Date; count: bigint }>
    >`
      SELECT DATE(created_at) AS date, COUNT(*)::bigint AS count
      FROM prediction_logs
      WHERE created_at >= ${since}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return rows.map((row) => ({
      date: this.toDateString(row.date),
      count: Number(row.count),
    }));
  }

  /**
   * F-AI-07 — accuracy among graded predictions only
   * (wasSuccessful IS NOT NULL).
   */
  async predictionAccuracy() {
    const [graded, successful] = await Promise.all([
      this.prisma.predictionLog.count({
        where: { wasSuccessful: { not: null } },
      }),
      this.prisma.predictionLog.count({
        where: { wasSuccessful: true },
      }),
    ]);

    const accuracyPercent =
      graded === 0 ? null : Math.round((successful / graded) * 10000) / 100;

    return {
      gradedCount: graded,
      successfulCount: successful,
      accuracyPercent,
    };
  }

  private sinceDate(days: number): Date {
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (days - 1));
    return since;
  }

  private toDateString(value: Date): string {
    return value instanceof Date
      ? value.toISOString().slice(0, 10)
      : String(value).slice(0, 10);
  }
}
