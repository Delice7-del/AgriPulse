import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { ListCropsQueryDto } from './dto/list-crops-query.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@Injectable()
export class CropsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ListCropsQueryDto) {
    return this.prisma.crop.findMany({
      where:
        query.isActive === undefined ? undefined : { isActive: query.isActive },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const crop = await this.prisma.crop.findUnique({ where: { id } });
    if (!crop) {
      throw new NotFoundException(`Crop with id "${id}" not found`);
    }
    return crop;
  }

  create(dto: CreateCropDto) {
    return this.prisma.crop.create({
      data: {
        name: dto.name,
        nameRw: dto.nameRw,
        unit: dto.unit ?? 'kg',
      },
    });
  }

  async update(id: string, dto: UpdateCropDto) {
    await this.findOne(id);
    return this.prisma.crop.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.crop.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
