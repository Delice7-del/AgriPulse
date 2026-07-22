import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CropMarketsService } from '../crop-markets/crop-markets.service';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { ListCropsQueryDto } from './dto/list-crops-query.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@ApiTags('crops')
@ApiBearerAuth()
@Controller('crops')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CropsController {
  constructor(
    private readonly cropsService: CropsService,
    private readonly cropMarketsService: CropMarketsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List crops (optional isActive filter)' })
  findAll(@Query() query: ListCropsQueryDto) {
    return this.cropsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a crop by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropsService.findOne(id);
  }

  @Get(':id/markets')
  @ApiOperation({
    summary: 'List active markets where a crop is available (F-USS-03)',
  })
  findMarketsForCrop(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropMarketsService.findActiveMarketsForCrop(id);
  }

  @Post()
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({ summary: 'Create a crop' })
  create(@Body() dto: CreateCropDto) {
    return this.cropsService.create(dto);
  }

  @Patch(':id')
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({ summary: 'Update a crop' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCropDto,
  ) {
    return this.cropsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({ summary: 'Soft-delete a crop (sets isActive: false)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropsService.remove(id);
  }
}
