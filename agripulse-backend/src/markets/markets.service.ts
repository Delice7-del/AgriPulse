import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { ListMarketsQueryDto } from './dto/list-markets-query.dto';
import { UpdateMarketDto } from './dto/update-market.dto';

@Injectable()
export class MarketsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ListMarketsQueryDto) {
    return this.prisma.market.findMany({
      where:
        query.isActive === undefined ? undefined : { isActive: query.isActive },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const market = await this.prisma.market.findUnique({ where: { id } });
    if (!market) {
      throw new NotFoundException(`Market with id "${id}" not found`);
    }
    return market;
  }

  create(dto: CreateMarketDto) {
    return this.prisma.market.create({
      data: {
        name: dto.name,
        region: dto.region,
      },
    });
  }

  async update(id: string, dto: UpdateMarketDto) {
    await this.findOne(id);
    return this.prisma.market.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.market.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
