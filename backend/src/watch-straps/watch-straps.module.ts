import { Module } from '@nestjs/common';
import { WatchStrapsController } from './watch-straps.controller';
import { WatchStrapsService } from './watch-straps.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WatchStrapsController],
  providers: [WatchStrapsService],
})
export class WatchStrapsModule {}


