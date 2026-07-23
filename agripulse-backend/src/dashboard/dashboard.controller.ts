import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';

class ActivityQueryDto {
  @ApiPropertyOptional({ default: 8, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Officer dashboard overview (counts, live prices, accuracy)',
  })
  overview() {
    return this.dashboardService.overview();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Recent officer price-entry activity' })
  activity(@Query() query: ActivityQueryDto) {
    return this.dashboardService.recentActivity(query.limit ?? 8);
  }
}
