import Fastify, { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { registerRoutes } from '../enpoints/routes';

export function build(): FastifyInstance {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  registerSwagger(app);
  registerSwaggerUI(app);
  registerRoutes(app);

  return app;
}

function registerSwagger(app: FastifyInstance) {
  app.register(swagger, {
    swagger: {
      info: {
        title: 'SeQura Backend',
        version: '1.0.0',
      },
    },
  });
}

function registerSwaggerUI(app: FastifyInstance) {
  app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}

export const start = async (fastify: FastifyInstance, PORT: number) => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  } catch (err) {
    console.error('Error starting server:', err);
    fastify.log.error(err);
    process.exit(1);
  }
};
