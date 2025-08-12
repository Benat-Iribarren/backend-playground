import { FastifyInstance } from 'fastify';
import requestOtp from './requestOtp/requestOtp';
import { otpRepository } from '../database/repository/SQLiteOtpRepository';
import { userRepository } from '../database/repository/SQLiteUserRepository';
import { randomCodeGenerator } from '../helpers/generators/randomCodeGenerator';
import { randomHashGenerator } from '../helpers/generators/randomHashGenerator';
import { blacklistPhoneValidator } from '../helpers/validators/blacklistPhoneValidator';
import { fromHashTokenGenerator } from '../helpers/generators/fromHashTokenGenerator';
import { tokenRepository } from '../database/repository/SQLiteTokenRepository';
import verifyOtp from './verifyOtp/verifyOtp';

export function registerRoutes(fastify: FastifyInstance) {
  fastify.register(
    requestOtp({
      otpRepository,
      userRepository,
      codeGenerator: randomCodeGenerator,
      hashGenerator: randomHashGenerator,
      phoneValidator: blacklistPhoneValidator,
    }),
  );

  fastify.register(
    verifyOtp({ tokenRepository, otpRepository, tokenGenerator: fromHashTokenGenerator }),
  );
}
