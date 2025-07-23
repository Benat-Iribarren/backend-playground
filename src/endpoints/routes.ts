import { FastifyInstance } from 'fastify';
import mainLogin from './mainLogin/mainLogin';
import otpCodeCreation from './otpCodeCreation/otpCodeCreation';
import otpLogin from './otpLogin/otpLogin';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.register(mainLogin);
  fastify.register(otpLogin);
  fastify.register(otpCodeCreation);
}
