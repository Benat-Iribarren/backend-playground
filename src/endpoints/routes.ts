import { FastifyInstance } from 'fastify';
import requestOtp from './auth/request-otp/request-otp';
import otpLogin from './otpLogin/otpLogin';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.register(requestOtp);
  fastify.register(otpLogin);
}
