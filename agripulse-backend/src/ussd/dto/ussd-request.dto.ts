import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UssdRequestDto {
  @ApiProperty({ example: 'ATUid_abc123' })
  @IsString()
  @MinLength(1)
  sessionId: string;

  @ApiProperty({
    example: '+250788123456',
    description: 'Hashed immediately; never stored or logged raw (NF-SEC-03)',
  })
  @IsString()
  @MinLength(1)
  phoneNumber: string;

  @ApiPropertyOptional({
    example: '1*2',
    description:
      'Accumulated USSD input path. Empty/absent on first request; then "1", "1*2", etc.',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ example: '*384*1#' })
  @IsOptional()
  @IsString()
  serviceCode?: string;
}
