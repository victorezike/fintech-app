import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, new ExpressAdapter());

  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const server = app.getHttpAdapter().getInstance();
  const router = server._router || server.router; 
  if (router && router.stack) {
    console.log('Available routes:');
    router.stack.forEach((layer: any) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods)
          .join(', ')
          .toUpperCase();
        console.log(`${methods} ${layer.route.path}`);
      }
    });
  } else {
    console.log('Router not found. Routes may not be registered.');
  }

  await app.listen(3000);
}
bootstrap();