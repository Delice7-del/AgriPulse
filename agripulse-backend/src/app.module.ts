import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { CropMarketsModule } from './crop-markets/crop-markets.module';
import { CropsModule } from './crops/crops.module';
import { MarketsModule } from './markets/markets.module';
import { PricesModule } from './prices/prices.module';
import { PredictionsModule } from './predictions/predictions.module';
import { PrismaModule } from './prisma/prisma.module';
import { UssdModule } from './ussd/ussd.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // NF-MAI-03: structured request logging
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        autoLogging: true,
        quietReqLogger: true,
      },
    }),
    PrismaModule,
    AuthModule,
    CropsModule,
    MarketsModule,
    CropMarketsModule,
    PricesModule,
    PredictionsModule,
    UssdModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
