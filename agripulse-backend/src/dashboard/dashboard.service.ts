import { Injectable } from '@nestjs/common';
import { AnalyticsService } from '../analytics/analytics.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: AnalyticsService,
  ) {}

  async overview() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      activeCrops,
      activeMarkets,
      todaySessions,
      recentPrices,
      predictionAccuracy,
      topCrops,
    ] = await Promise.all([
      this.prisma.crop.count({ where: { isActive: true } }),
      this.prisma.market.count({ where: { isActive: true } }),
      this.prisma.ussdSession.count({
        where: { startedAt: { gte: startOfDay } },
      }),
      this.prisma.dailyPrice.findMany({
        orderBy: { recordedAt: 'desc' },
        take: 8,
        include: { crop: true, market: true },
      }),
      this.analytics.predictionAccuracy(),
      this.analytics.topCrops(30),
    ]);

    const topCrop = topCrops[0] ?? null;

    return {
      stats: {
        activeCrops,
        activeMarkets,
        todaySessions,
        topQueriedCrop: topCrop
          ? { name: topCrop.name, queryCount: topCrop.queryCount }
          : null,
      },
      livePrices: recentPrices.map((row) => ({
        id: row.id,
        crop: row.crop.name,
        market: row.market.name,
        price: Number(row.price),
        recordedAt: row.recordedAt,
        unit: row.crop.unit,
      })),
      predictionAccuracy,
    };
  }

  async recentActivity(limit = 8) {
    const prices = await this.prisma.dailyPrice.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        crop: true,
        market: true,
        createdBy: { select: { fullName: true, email: true } },
      },
    });

    return prices.map((row) => ({
      id: row.id,
      type: 'price_entry' as const,
      title: `${row.crop.name} @ ${row.market.name}`,
      meta: `${Number(row.price).toFixed(0)} RWF/${row.crop.unit}`,
      officer: row.createdBy?.fullName ?? 'Unknown officer',
      at: row.createdAt,
    }));
  }
}
