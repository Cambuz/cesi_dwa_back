import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - User Service',
      version: '1.0.0',
      description: 'Documentation de l\'API user-services',
    },
    servers: [{ url: 'http://localhost:4000' }],
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