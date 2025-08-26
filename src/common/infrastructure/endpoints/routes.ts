import { FastifyInstance } from 'fastify';

import requestOtp from '@auth/infrastructure/endpoints/requestOtp/requestOtp';
import verifyOtp from '@auth/infrastructure/endpoints/verifyOtp/verifyOtp';
import { otpRepository } from '@auth/infrastructure/database/repositories/SQLiteOtpRepository';
import { codeGenerator } from '@auth/infrastructure/helpers/generators/randomCodeGenerator';
import { hashGenerator } from '@auth/infrastructure/helpers/generators/randomHashGenerator';
import { phoneValidator } from '@auth/infrastructure/helpers/validators/blacklistPhoneValidator';
import { tokenGenerator } from '@common/infrastructure/helpers/generators/TokenGenerator';
import { tokenRepository } from '@auth/infrastructure/database/repositories/SQLiteTokenRepository';

import updateProfile from '@user/infrastructure/endpoints/updateProfile/updateProfile';
import getProfile from '@user/infrastructure/endpoints/getProfile/getProfile';
import { userRepository } from '@user/infrastructure/database/repositories/SQLiteUserRepository';
import authenticateUser from '@auth/infrastructure/http/authenticate';
import addCard from '@user/infrastructure/endpoints/addCard/addCard';
import { cardRepository } from '@user/infrastructure/database/repositories/SQLiteCardRepository';
import registerGetCards from '@user/infrastructure/endpoints/getCards/getCards';

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
    app.register(authenticateUser);
    app.register(getProfile());
    app.register(updateProfile());
    app.register(
      addCard({
        cardRepository,
        tokenGenerator,
      }),
    );
    app.register(registerGetCards());
  });
}
