import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    allowedHeaders: [
      'origin',
      'x-requested-with',
      'content-type',
      'accept',
      'authorization',
    ],
    credentials: true, // if you need to allow cookies
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
