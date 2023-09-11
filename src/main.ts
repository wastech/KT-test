import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swaggerConfig';
import helmet from 'helmet'; // Helmet middleware for HTTP security
import rateLimit from 'express-rate-limit'; // Rate limiting middleware

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed
  app.enableCors();

  // Add Helmet middleware for basic HTTP security headers
  app.use(helmet());

  // Configure Rate Limiting middleware
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
    }),
  );

  // Global validation pipe for input validation
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger for API documentation
  setupSwagger(app);

  // Start the server
  await app.listen(process.env.PORT || 5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
