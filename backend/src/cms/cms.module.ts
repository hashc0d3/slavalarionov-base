import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}

