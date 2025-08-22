import { FastifyInstance } from 'fastify';

import requestOtp from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import verifyOtp from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { otpRepository } from '@auth/infrastructure/database/repositories/SQLiteOtpRepository';
import { codeGenerator } from '@auth/infrastructure/helpers/generators/randomCodeGenerator';
import { hashGenerator } from '@auth/infrastructure/helpers/generators/randomHashGenerator';
import { phoneValidator } from '@auth/infrastructure/helpers/validators/blacklistPhoneValidator';
import { tokenGenerator } from '@auth/infrastructure/helpers/generators/fromHashTokenGenerator';
import { tokenRepository } from '@auth/infrastructure/database/repositories/SQLiteTokenRepository';

import registerGetProfile from '@user/infrastructure/endpoints/getProfile/getProfile';
import { userRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';

import authPlugin from '@auth/infrastructure/http/authenticate';
export function registerRoutes(fastify: FastifyInstance) {
  // --- AUTH ---
  fastify.register(
    requestOtp({
      otpRepository,
      userRepository,
      codeGenerator,
      hashGenerator,
      phoneValidator,
    }),
  );

  fastify.register(
    verifyOtp({
      tokenRepository,
      otpRepository,
      tokenGenerator,
    }),
  );

  // --- USER ---
  fastify.register(async (app) => {
    app.register(authPlugin);
    app.register(registerGetProfile());
  });
}
