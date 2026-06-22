import express, { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import temperatureRoutes from './routes/temperature.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Temperature Converter API',
        version: '1.0.0',
        description: 'API for converting temperatures between Celsius, Fahrenheit, and Kelvin.',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./src/**/*.ts'],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec));
  app.get('/api-docs/', swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.status(200).json(swaggerSpec);
  });

  app.use('/', temperatureRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
