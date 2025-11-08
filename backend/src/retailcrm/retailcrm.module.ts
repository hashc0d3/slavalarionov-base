import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from '../telegram/telegram.module';
import { RetailCrmController } from './retailcrm.controller';
import { RetailCrmService } from './retailcrm.service';

@Module({
  imports: [HttpModule, ConfigModule, TelegramModule],
  controllers: [RetailCrmController],
  providers: [RetailCrmService],
  exports: [RetailCrmService],
})
export class RetailCrmModule {}

