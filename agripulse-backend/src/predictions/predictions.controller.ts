import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { PredictionsService } from './predictions.service';

@ApiTags('predictions')
@ApiBearerAuth()
@Controller('predictions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Post()
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({
    summary:
      'Run AI price advice (Step A baseline stub — F-AI-01–06 / F-BAC-03)',
  })
  predict(@Body() dto: CreatePredictionDto) {
    return this.predictionsService.predict(dto);
  }
}
