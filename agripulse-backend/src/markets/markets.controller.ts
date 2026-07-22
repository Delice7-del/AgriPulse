import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateMarketDto } from './dto/create-market.dto';
import { ListMarketsQueryDto } from './dto/list-markets-query.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { MarketsService } from './markets.service';

@ApiTags('markets')
@ApiBearerAuth()
@Controller('markets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  @ApiOperation({ summary: 'List markets (optional isActive filter)' })
  findAll(@Query() query: ListMarketsQueryDto) {
    return this.marketsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a market by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.marketsService.findOne(id);
  }

  @Post()
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({ summary: 'Create a market' })
  create(@Body() dto: CreateMarketDto) {
    return this.marketsService.create(dto);
  }

  @Patch(':id')
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({ summary: 'Update a market' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMarketDto,
  ) {
    return this.marketsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(AdminRole.SYSTEM_ADMIN, AdminRole.OFFICER)
  @ApiOperation({ summary: 'Soft-delete a market (sets isActive: false)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.marketsService.remove(id);
  }
}
