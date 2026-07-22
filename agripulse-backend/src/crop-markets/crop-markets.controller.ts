import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
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
import { CropMarketsService } from './crop-markets.service';
import { CreateCropMarketDto } from './dto/create-crop-market.dto';

@ApiTags('crop-markets')
@ApiBearerAuth()
@Controller('crop-markets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CropMarketsController {
  constructor(private readonly cropMarketsService: CropMarketsService) {}

  @Post()
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({ summary: 'Mark a crop as available at a market' })
  create(@Body() dto: CreateCropMarketDto) {
    return this.cropMarketsService.create(dto);
  }

  @Delete(':id')
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({ summary: 'Mark a crop unavailable at a market' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropMarketsService.remove(id);
  }
}
