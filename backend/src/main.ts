import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,  // Изменили на false, чтобы не отбрасывать дополнительные поля
    forbidNonWhitelisted: false
  }));

  // Увеличиваем лимит размера тела запроса до 10MB для поддержки base64 изображений
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  
  const port = process.env.PORT || 8081;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();