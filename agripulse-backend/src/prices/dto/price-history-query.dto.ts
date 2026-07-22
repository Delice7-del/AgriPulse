import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class PriceHistoryQueryDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  cropId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  marketId: string;

  @ApiPropertyOptional({ example: 30, default: 30, minimum: 1, maximum: 365 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number = 30;
}
