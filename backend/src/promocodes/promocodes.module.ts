import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';

@Module({
  imports: [PrismaModule],
  providers: [PromocodesService],
  controllers: [PromocodesController],
  exports: [PromocodesService],
})
export class PromocodesModule {}
