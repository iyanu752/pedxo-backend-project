import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ENVIRONMENT } from './common/constant/enivronment/enviroment';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = ENVIRONMENT.CONNECTION.PORT;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allow all HTTP methods
    allowedHeaders: '*', // Allow all headers
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(PORT);
}
bootstrap();
