import { Module } from '@nestjs/common';
import { CropMarketsController } from './crop-markets.controller';
import { CropMarketsService } from './crop-markets.service';

@Module({
  controllers: [CropMarketsController],
  providers: [CropMarketsService],
  exports: [CropMarketsService],
})
export class CropMarketsModule {}
