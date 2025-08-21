import { FastifyInstance } from 'fastify';
import requestOtp from './requestOtp/requestOtp';
import { otpRepository } from '../database/repositories/SQLiteOtpRepository';
import { userRepository } from '@common/infrastructure/database/repositories/SQLiteUserRepository';
import { codeGenerator } from '../helpers/generators/randomCodeGenerator';
import { hashGenerator } from '../helpers/generators/randomHashGenerator';
import { phoneValidator } from '../helpers/validators/blacklistPhoneValidator';
import { tokenGenerator } from '../helpers/generators/fromHashTokenGenerator';
import { tokenRepository } from '../database/repositories/SQLiteTokenRepository';
import verifyOtp from './verifyOtp/verifyOtp';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.register(
    requestOtp({
      otpRepository,
      userRepository,
      codeGenerator,
      hashGenerator,
      phoneValidator,
    }),
  );

  fastify.register(verifyOtp({ tokenRepository, otpRepository, tokenGenerator }));
}
