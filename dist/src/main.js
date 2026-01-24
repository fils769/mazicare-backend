"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const logging_interceptor_1 = require("./logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
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
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
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
//# sourceMappingURL=main.js.map