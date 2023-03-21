import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

const PORT = process.env.PORT || 5000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(morgan('dev'));

  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
  });
}
bootstrap();
