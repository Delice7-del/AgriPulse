import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('admin-users')
@ApiBearerAuth()
@Controller('admin-users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Roles(AdminRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Create an admin user (SYSTEM_ADMIN only)',
  })
  create(@Body() dto: CreateAdminUserDto) {
    return this.authService.createAdminUser(dto);
  }
}
