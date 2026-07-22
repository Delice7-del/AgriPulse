import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({ example: 'Maize' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({ example: 'Ibigori' })
  @IsOptional()
  @IsString()
  nameRw?: string;

  @ApiPropertyOptional({ example: 'kg', default: 'kg' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  unit?: string;
}
