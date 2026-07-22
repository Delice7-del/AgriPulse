import { Module } from '@nestjs/common';
import { PredictionsModule } from '../predictions/predictions.module';
import { UssdController } from './ussd.controller';
import { UssdService } from './ussd.service';

@Module({
  imports: [PredictionsModule],
  controllers: [UssdController],
  providers: [UssdService],
})
export class UssdModule {}
