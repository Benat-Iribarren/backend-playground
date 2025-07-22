import { FastifyInstance } from 'fastify';
import mainLogin from './mainLogin/mainLogin';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.register(mainLogin);
}
