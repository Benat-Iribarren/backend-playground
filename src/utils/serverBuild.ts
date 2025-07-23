import Fastify, { fastify, FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { registerRoutes } from '../endpoints/routes';

export function build(): FastifyInstance {
  const app = Fastify({
    logger:
      process.env.NODE_ENV !== 'test'
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            },
          }
        : false,
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
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}

export const start = async (fastify: FastifyInstance, PORT: number) => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
