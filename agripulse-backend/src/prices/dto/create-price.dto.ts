import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreatePriceDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  cropId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  marketId: string;

  @ApiProperty({ example: 450.5, description: 'Price in RWF per unit' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    description: 'Business timestamp for this price snapshot',
    example: '2026-07-22T12:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  recordedAt?: Date;
}
