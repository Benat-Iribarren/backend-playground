import { FastifyInstance } from 'fastify';
import { otpLoginSchema } from './schema';
import { isValidNin } from '../utils/validators/ninValidator';
import { isValidPhone } from '../utils/validators/phoneValidator';
import { User } from '../../domain/userType';

const OTP_LOGIN_ENDPOINT = '/login/otp';
const MESSAGES = {
  MISSING_CODE_NIN_OR_PHONE: 'Missing verification code, nin or phone number.',
  INVALID_NIN_OR_PHONE: 'Invalid nin or phone number.',
  INVALID_CODE: 'Invalid verification code.',
  SUCCESSFULL_RESULT: 'User logged in successfully',
  USER_BLOCKED: 'User is blocked.',
  USER_NOT_FOUND: 'User not found.',
};

const BLOCKED_PHONE = '666666667';
const BLOCKED_NIN = '12345678B';

const VALID_NIN = '12345678A';
const VALID_PHONE = '666666666';
const VALID_CODE = '123456';

async function otpLogin(fastify: FastifyInstance) {
  fastify.post(OTP_LOGIN_ENDPOINT, otpLoginSchema, async (request, reply) => {
    const { nin, phone, verificationCode } = request.body as User & { verificationCode: string };

    if (missingParameters(nin, phone, verificationCode)) {
      return reply.status(400).send({ error: MESSAGES.MISSING_CODE_NIN_OR_PHONE });
    }

    if (invalidNinOrPhoneParameters(nin, phone)) {
      return reply.status(400).send({ error: MESSAGES.INVALID_NIN_OR_PHONE });
    }

    if (invalidCode(verificationCode)) {
      return reply.status(400).send({ error: MESSAGES.INVALID_CODE });
    }

    if (blockedUser({ nin, phone })) {
      return reply.status(403).send({ error: MESSAGES.USER_BLOCKED });
    }

    if (validUser({ nin, phone })) {
      return reply.status(200).send({ message: MESSAGES.SUCCESSFULL_RESULT });
    }

    return reply.status(404).send({ error: MESSAGES.USER_NOT_FOUND });
  });
}

function missingParameters(nin: string, phone: string, verificationCode: string): boolean {
  return !nin || !phone || !verificationCode;
}

function invalidNinOrPhoneParameters(nin: string, phone: string): boolean {
  return !isValidNin(nin) || !isValidPhone(phone);
}

function blockedUser(user: User): boolean {
  return user.nin === BLOCKED_NIN && user.phone === BLOCKED_PHONE;
}

function validUser(user: User): boolean {
  return user.nin === VALID_NIN && user.phone === VALID_PHONE;
}

function invalidCode(verificationCode: string): boolean {
  const codeRegex = /^[0-9]{6}$/;
  return !codeRegex.test(verificationCode) || verificationCode !== VALID_CODE;
}

export default otpLogin;
