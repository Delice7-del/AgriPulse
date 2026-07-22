import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreatePredictionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  cropId: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Optional — F-AI-01 allows no market selected',
  })
  @IsOptional()
  @IsUUID()
  marketId?: string;

  @ApiPropertyOptional({
    example: 14,
    default: 14,
    description: 'Max historical points to load (window)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(7)
  @Max(90)
  historicalDataWindow?: number;
}
