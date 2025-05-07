import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Client Service',
      version: '1.0.0',
      description: 'Documentation de l\'API client-services',
    },
    servers: [{ url: 'http://localhost:4002' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/docs/*.ts'],
};


export default swaggerOptions;