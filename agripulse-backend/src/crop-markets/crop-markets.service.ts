import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCropMarketDto } from './dto/create-crop-market.dto';

@Injectable()
export class CropMarketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCropMarketDto) {
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

    const existing = await this.prisma.cropMarket.findUnique({
      where: {
        cropId_marketId: {
          cropId: dto.cropId,
          marketId: dto.marketId,
        },
      },
    });

    if (existing) {
      if (existing.isActive) {
        throw new ConflictException(
          'This crop is already available at that market',
        );
      }

      return this.prisma.cropMarket.update({
        where: { id: existing.id },
        data: { isActive: true },
        include: { crop: true, market: true },
      });
    }

    return this.prisma.cropMarket.create({
      data: {
        cropId: dto.cropId,
        marketId: dto.marketId,
      },
      include: { crop: true, market: true },
    });
  }

  async remove(id: string) {
    const link = await this.prisma.cropMarket.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Crop-market link with id "${id}" not found`);
    }

    return this.prisma.cropMarket.update({
      where: { id },
      data: { isActive: false },
      include: { crop: true, market: true },
    });
  }

  findAll(filters?: {
    cropId?: string;
    marketId?: string;
    isActive?: boolean;
  }) {
    return this.prisma.cropMarket.findMany({
      where: {
        ...(filters?.cropId ? { cropId: filters.cropId } : {}),
        ...(filters?.marketId ? { marketId: filters.marketId } : {}),
        ...(filters?.isActive === undefined
          ? {}
          : { isActive: filters.isActive }),
      },
      include: { crop: true, market: true },
      orderBy: [{ crop: { name: 'asc' } }, { market: { name: 'asc' } }],
    });
  }

  async findActiveMarketsForCrop(cropId: string) {
    const crop = await this.prisma.crop.findUnique({ where: { id: cropId } });
    if (!crop) {
      throw new NotFoundException(`Crop with id "${cropId}" not found`);
    }

    const links = await this.prisma.cropMarket.findMany({
      where: {
        cropId,
        isActive: true,
        market: { isActive: true },
      },
      include: { market: true },
      orderBy: { market: { name: 'asc' } },
    });

    return links.map((link) => link.market);
  }
}
