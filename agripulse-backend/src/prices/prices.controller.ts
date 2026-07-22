import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePriceDto } from './dto/create-price.dto';
import { LatestPricesQueryDto } from './dto/latest-prices-query.dto';
import { ListPricesQueryDto } from './dto/list-prices-query.dto';
import { PriceHistoryQueryDto } from './dto/price-history-query.dto';
import { PricesService } from './prices.service';

@ApiTags('prices')
@ApiBearerAuth()
@Controller('prices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post()
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({
    summary: 'Append a new daily price snapshot (F-ADM-04 / F-ADM-08)',
  })
  create(
    @Body() dto: CreatePriceDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.pricesService.create(dto, user.id);
  }

  @Get('latest')
  @ApiOperation({
    summary:
      'Most recent price per crop/market (F-USS-04). Optional cropId+marketId filters to a single pair.',
  })
  findLatest(@Query() query: LatestPricesQueryDto) {
    return this.pricesService.findLatest(query);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Price time series for a crop/market pair (AI model input)',
  })
  findHistory(@Query() query: PriceHistoryQueryDto) {
    return this.pricesService.findHistory(query);
  }

  @Get()
  @ApiOperation({
    summary: 'Paginated price list for admin dashboard (F-ADM-05)',
  })
  findAll(@Query() query: ListPricesQueryDto) {
    return this.pricesService.findAll(query);
  }
}
