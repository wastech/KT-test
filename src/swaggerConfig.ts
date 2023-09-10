import * as path from 'path';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app) {
  const options = new DocumentBuilder()
    .setTitle('Fresh Picked Fare')
    .setDescription(
      'Fresh Picked Fare is a web app that specializes in offering freshly harvested or farm-sourced food products, with an emphasis on quality, health, and sustainability. It creates a positive and appealing image for customers who value fresh, natural, and locally-sourced food options. ',
    )
    .setVersion('1.0.0')
    .addBearerAuth() // Add bearer token authentication
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const swaggerPath = path.resolve(__dirname, 'swagger.json');
  fs.writeFileSync(swaggerPath, JSON.stringify(document, null, 2));

  SwaggerModule.setup('api-docs', app, document);
}