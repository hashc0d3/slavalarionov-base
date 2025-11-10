import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NextMiddleware } from '../next.middleware';
import { LegacyController } from './legacy/legacy.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WatchModelsModule } from './watch-models/watch-models.module';
import { WatchStrapsModule } from './watch-straps/watch-straps.module';
import { PaymentModule } from './payment/payment.module';
import { RetailCrmModule } from './retailcrm/retailcrm.module';
import { TelegramModule } from './telegram/telegram.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { DeliveryModule } from './delivery/delivery.module';
import { UploadsModule } from './uploads/uploads.module';
import { ConfiguratorModule } from './configurator/configurator.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    PrismaModule,
    WatchModelsModule,
    WatchStrapsModule,
    PaymentModule,
    RetailCrmModule,
    TelegramModule,
    PromocodesModule,
    DeliveryModule,
    UploadsModule,
    ConfiguratorModule,
  ],
  controllers: [AppController, LegacyController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // NextMiddleware сам пропускает /api запросы к NestJS роутам
    consumer
      .apply(NextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
