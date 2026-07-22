import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { LatestPricesQueryDto } from './dto/latest-prices-query.dto';
import { ListPricesQueryDto } from './dto/list-prices-query.dto';
import { PriceHistoryQueryDto } from './dto/price-history-query.dto';

type LatestPriceRow = {
  id: string;
  cropId: string;
  marketId: string;
  price: Prisma.Decimal;
  recordedAt: Date;
  createdAt: Date;
  createdById: string | null;
};

@Injectable()
export class PricesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePriceDto, createdById: string) {
    const crop = await this.prisma.crop.findUnique({
      where: { id: dto.cropId },
    });
    if (!crop || !crop.isActive) {
      throw new NotFoundException(`Crop with id "${dto.cropId}" not found`);
    }

    const market = await this.prisma.market.findUnique({
      where: { id: dto.marketId },
    });
    if (!market || !market.isActive) {
      throw new NotFoundException(`Market with id "${dto.marketId}" not found`);
    }

    const price = await this.prisma.dailyPrice.create({
      data: {
        cropId: dto.cropId,
        marketId: dto.marketId,
        price: new Prisma.Decimal(dto.price),
        recordedAt: dto.recordedAt ?? new Date(),
        createdById,
      },
      include: {
        crop: true,
        market: true,
      },
    });

    // F-ADM-08 — confirmation message for admin price entry
    return {
      message: 'Price updated successfully',
      data: price,
    };
  }

  async findLatest(query: LatestPricesQueryDto) {
    // Fast path: single crop/market pair (F-USS-04 / USSD)
    if (query.cropId && query.marketId) {
      const latest = await this.prisma.dailyPrice.findFirst({
        where: { cropId: query.cropId, marketId: query.marketId },
        orderBy: { recordedAt: 'desc' },
        include: { crop: true, market: true },
      });

      if (!latest) {
        throw new NotFoundException(
          `No price found for crop "${query.cropId}" at market "${query.marketId}"`,
        );
      }

      return latest;
    }

    // Efficient Postgres pattern: DISTINCT ON (crop_id, market_id)
    const rows = await this.prisma.$queryRaw<LatestPriceRow[]>`
      SELECT DISTINCT ON (crop_id, market_id)
        id,
        crop_id AS "cropId",
        market_id AS "marketId",
        price,
        recorded_at AS "recordedAt",
        created_at AS "createdAt",
        created_by_id AS "createdById"
      FROM daily_prices
      WHERE (${query.cropId ?? null}::uuid IS NULL OR crop_id = ${query.cropId ?? null}::uuid)
        AND (${query.marketId ?? null}::uuid IS NULL OR market_id = ${query.marketId ?? null}::uuid)
      ORDER BY crop_id, market_id, recorded_at DESC
    `;

    return rows;
  }

  async findHistory(query: PriceHistoryQueryDto) {
    const days = query.days ?? 30;
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);

    return this.prisma.dailyPrice.findMany({
      where: {
        cropId: query.cropId,
        marketId: query.marketId,
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: 'asc' },
      include: { crop: true, market: true },
    });
  }

  /**
   * Recent price points for AI prediction (chronological).
   * marketId optional per F-AI-01 (crop-level series when omitted).
   */
  async findRecentPricePoints(
    cropId: string,
    marketId: string | undefined,
    limit: number,
  ) {
    const rows = await this.prisma.dailyPrice.findMany({
      where: {
        cropId,
        ...(marketId ? { marketId } : {}),
      },
      orderBy: { recordedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        cropId: true,
        marketId: true,
        price: true,
        recordedAt: true,
      },
    });

    return rows.reverse();
  }

  async findAll(query: ListPricesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.DailyPriceWhereInput = {
      ...(query.cropId ? { cropId: query.cropId } : {}),
      ...(query.marketId ? { marketId: query.marketId } : {}),
      ...((query.from || query.to) && {
        recordedAt: {
          ...(query.from ? { gte: query.from } : {}),
          ...(query.to ? { lte: query.to } : {}),
        },
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.dailyPrice.findMany({
        where,
        orderBy: { recordedAt: 'desc' },
        skip,
        take: limit,
        include: { crop: true, market: true },
      }),
      this.prisma.dailyPrice.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
