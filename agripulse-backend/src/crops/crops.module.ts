import { Module } from '@nestjs/common';
import { CropMarketsModule } from '../crop-markets/crop-markets.module';
import { CropsController } from './crops.controller';
import { CropsService } from './crops.service';

@Module({
  imports: [CropMarketsModule],
  controllers: [CropsController],
  providers: [CropsService],
  exports: [CropsService],
})
export class CropsModule {}
