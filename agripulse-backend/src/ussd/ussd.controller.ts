import { Body, Controller, Header, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UssdRequestDto } from './dto/ussd-request.dto';
import { UssdService } from './ussd.service';

@ApiTags('ussd')
@Controller('ussd')
export class UssdController {
  constructor(private readonly ussdService: UssdService) {}

  @Post()
  @HttpCode(200)
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @ApiOperation({
    summary:
      'Telecom gateway USSD callback (F-USS-01–07). Returns CON/END plain text.',
  })
  handle(@Body() dto: UssdRequestDto): Promise<string> {
    return this.ussdService.handle(dto);
  }
}
