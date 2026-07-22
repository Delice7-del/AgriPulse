import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsDaysQueryDto } from './dto/analytics-days-query.dto';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sessions-per-day')
  @ApiOperation({
    summary: 'USSD sessions per day (F-ADM-06)',
  })
  sessionsPerDay(@Query() query: AnalyticsDaysQueryDto) {
    return this.analyticsService.sessionsPerDay(query.days ?? 30);
  }

  @Get('top-crops')
  @ApiOperation({
    summary: 'Most-queried crops from USSD (F-ADM-06)',
  })
  topCrops(@Query() query: AnalyticsDaysQueryDto) {
    return this.analyticsService.topCrops(query.days ?? 30);
  }

  @Get('prediction-usage')
  @ApiOperation({
    summary: 'PredictionLog volume over time (F-AI-07 / dashboard)',
  })
  predictionUsage(@Query() query: AnalyticsDaysQueryDto) {
    return this.analyticsService.predictionUsage(query.days ?? 30);
  }

  @Get('prediction-accuracy')
  @ApiOperation({
    summary:
      'Share of graded predictions with wasSuccessful=true (F-AI-07)',
  })
  predictionAccuracy() {
    return this.analyticsService.predictionAccuracy();
  }
}
