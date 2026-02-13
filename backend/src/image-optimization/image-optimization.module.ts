import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImageOptimizationService } from './image-optimization.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxContentLength: 10 * 1024 * 1024,
    }),
  ],
  providers: [ImageOptimizationService],
  exports: [ImageOptimizationService],
})
export class ImageOptimizationModule {}
