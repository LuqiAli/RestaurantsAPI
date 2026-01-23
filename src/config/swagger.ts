import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Restaurants API',
      version: '1.0.0',
      description: 'Restaurants API using expressJs with SwaggerUi Documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
  },
  // Paths to files containing OpenAPI annotations
  apis: ['./src/route/*.ts'],
};

export const swaggerSpec = swaggerJsDoc(swaggerOptions)

export const swaggerMiddleware = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(swaggerSpec)
}
