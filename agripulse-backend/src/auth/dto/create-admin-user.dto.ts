import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'officer@agripulse.rw' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Jean Uwimana' })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ enum: AdminRole, example: AdminRole.OFFICER })
  @IsEnum(AdminRole)
  role: AdminRole;
}
