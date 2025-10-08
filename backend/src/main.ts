import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8081;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});