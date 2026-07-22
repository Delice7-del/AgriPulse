import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateCropMarketDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  cropId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  marketId: string;
}
