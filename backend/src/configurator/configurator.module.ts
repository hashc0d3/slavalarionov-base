import { Module } from '@nestjs/common';
import { ConfiguratorService } from './configurator.service';
import { ConfiguratorController } from './configurator.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConfiguratorController],
  providers: [ConfiguratorService],
  exports: [ConfiguratorService],
})
export class ConfiguratorModule {}

