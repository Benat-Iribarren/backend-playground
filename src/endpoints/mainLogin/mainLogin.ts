import { FastifyInstance } from 'fastify';
import { mainLoginSchema } from './schema';
import { isValidNin } from '../utils/validators/ninValidator';
import { isValidPhone } from '../utils/validators/phoneValidator';
import { User } from '../../domain/userType';

const MAIN_LOGIN_ENDPOINT = '/login';
const MESSAGES = {
  INVALID_OR_MISSING_NIN_OR_PHONE: 'Invalid or missing nin or phone number',
  SUCCESSFULL_RESULT: 'Main login completed successfully',
  USER_BLOCKED: 'User is blocked',
};

const BLOCKED_PHONE = '666666667';
const BLOCKED_NIN = '12345678B';

const VALID_NIN = '12345678A';
const VALID_PHONE = '666666666';

async function mainLogin(fastify: FastifyInstance) {
  fastify.post(MAIN_LOGIN_ENDPOINT, mainLoginSchema, async (request, reply) => {
    const { nin, phone } = request.body as User;

    if (invalidOrMissingParameters(nin, phone)) {
      return reply.status(400).send({ error: MESSAGES.INVALID_OR_MISSING_NIN_OR_PHONE });
    }

    if (blockedUser({ nin, phone })) {
      return reply.status(402).send({ error: MESSAGES.USER_BLOCKED });
    }

    if (validUser({ nin, phone })) {
      return reply.status(200).send({ message: MESSAGES.SUCCESSFULL_RESULT });
    }

    return reply.status(400).send({ error: MESSAGES.INVALID_OR_MISSING_NIN_OR_PHONE });
  });

  function blockedUser(user: User) {
    return user.nin === BLOCKED_NIN && user.phone === BLOCKED_PHONE;
  }

  function validUser(user: User) {
    return user.nin === VALID_NIN && user.phone === VALID_PHONE;
  }
}

function invalidOrMissingParameters(nin: string, phone: string): boolean {
  return !nin || !phone || !isValidNin(nin) || !isValidPhone(phone);
}

export default mainLogin;
