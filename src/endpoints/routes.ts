import { FastifyInstance } from 'fastify';
import requestOtp from './auth/request-otp/request-otp';
import otpLogin from './auth/verify-otp/verify-otp';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.register(requestOtp);
  fastify.register(otpLogin);
}
