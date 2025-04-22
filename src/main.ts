import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// Create Express server
const server = express();

// Initialize NestJS with Express
async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server)
  );
  
  // Enable CORS
  app.enableCors();
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Balance Service API')
    .setDescription('ETH balance query service for multiple chains')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Balance Service API',
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-standalone-preset.js'
    ]
  };
  SwaggerModule.setup('docs', app, document, customOptions);
  
  // Initialize the application
  await app.init();
  
  // Start server if not in production (local development)
  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  }
  
  return server;
}

// For serverless environments
let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer;
}

export default bootstrapServer(); 