import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('MaziCare API')
    .setDescription('MaziCare Backend API - Caregiver and Family Care Management Platform')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('caregivers', 'Caregiver management')
    .addTag('families', 'Family management')
    .addTag('elders', 'Elder care management')
    .addTag('messages', 'Messaging system')
    .addTag('notifications', 'Notification management')
    .addTag('events', 'Event management')
    .addTag('subscriptions', 'Subscription management')
    .addTag('payments', 'Payment processing')
    .addTag('admin', 'Admin operations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'MaziCare API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
