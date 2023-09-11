import * as path from 'path';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app) {
  const options = new DocumentBuilder()
    .setTitle('Wallet Transaction Management System ')
    .setDescription(
      'The Wallet Transaction Management System is a robust and secure web application built with NestJS, a powerful TypeScript framework for building scalable and efficient server-side applications. This system provides users with a convenient way to manage their digital wallet transactions, ensuring secure money transfers between users while maintaining detailed transaction logs.',
    )
    .setVersion('1.0.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const swaggerPath = path.resolve(__dirname, 'swagger.json');
  fs.writeFileSync(swaggerPath, JSON.stringify(document, null, 2));

  SwaggerModule.setup('api-docs', app, document);
}
