import { Module } from '@nestjs/common';
import { WatchModelsController } from './watch-models.controller';
import { WatchModelsService } from './watch-models.service';

@Module({
  controllers: [WatchModelsController],
  providers: [WatchModelsService],
  exports: [WatchModelsService],
})
export class WatchModelsModule {}

