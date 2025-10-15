import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NextMiddleware } from './next.middleware';
import { LegacyController } from './legacy/legacy.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CmsModule } from './cms/cms.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, CmsModule],
  controllers: [AppController, LegacyController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
