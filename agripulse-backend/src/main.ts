import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  // NF-SEC-04 — reject unknown fields; strip non-whitelisted properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  const config = app.get(ConfigService);

  // Browser admin SPA (Next.js) — comma-separated origins, or * in local/dev
  const corsOrigin = config.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000,http://localhost:3001';
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()).filter(Boolean),
    credentials: true,
  });

  // NF-MAI-01 — OpenAPI docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AgriPulse API')
    .setDescription('AgriPulse backend — crop prices, USSD, and predictions')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT', 3000);

  await app.listen(port);
}
bootstrap();
