import { FastifyInstance } from 'fastify';
import { requestOtpSchema } from './schema';
import { isValidNin } from '../../../domain/helpers/validators/ninValidator';
import { isValidPhone } from '../../../domain/helpers/validators/phoneValidator';
import { User } from '../../../domain/model/userType';
import { generateHash, generateOtp } from '../../../application/otp/OtpService';
import { HashCode } from '../../../domain/model/hashCode';
import { Otp } from '../../../domain/model/otpType';

const REQUEST_OTP_ENDPOINT = '/auth/request-otp';
const MESSAGES = {
  MISSING_NIN_OR_PHONE: 'Missing nin or phone number.',
  INVALID_NIN_OR_PHONE: 'Invalid nin or phone number.',
  USER_BLOCKED: 'User is blocked.',
  USER_NOT_FOUND: 'User not found.',
};

const BLOCKED_PHONE = '666666667';
const BLOCKED_NIN = '12345678B';

const VALID_NIN = '12345678A';
const VALID_PHONE1 = '666666666';
const VALID_PHONE2 = '111111111';

async function requestOtp(fastify: FastifyInstance) {
  fastify.post(REQUEST_OTP_ENDPOINT, requestOtpSchema, async (request, reply) => {
    const { nin, phone } = request.body as User;

    if (missingParameters(nin, phone)) {
      return reply.status(400).send({ error: MESSAGES.MISSING_NIN_OR_PHONE });
    }

    if (invalidParameters(nin, phone)) {
      return reply.status(400).send({ error: MESSAGES.INVALID_NIN_OR_PHONE });
    }

    if (blockedUser({ nin, phone })) {
      return reply.status(403).send({ error: MESSAGES.USER_BLOCKED });
    }

    if (validUser({ nin, phone })) {
      if (incorrectPhoneNumber(phone)) {
        return reply.status(200).send({ hash: '', verificationCode: '' });
      }
      const hash: HashCode = generateHash();
      const verificationCode: Otp = generateOtp(hash);
      return reply.status(200).send({ hash: hash, verificationCode: verificationCode });
    }

    return reply.status(404).send({ error: MESSAGES.USER_NOT_FOUND });
  });
}

function incorrectPhoneNumber(phone: string): boolean {
  return phone === BLOCKED_PHONE;
}

function blockedUser(user: User): boolean {
  return user.nin === BLOCKED_NIN && user.phone === BLOCKED_PHONE;
}

function validUser(user: User): boolean {
  return user.nin === VALID_NIN && (user.phone === VALID_PHONE1 || user.phone === VALID_PHONE2 || user.phone === BLOCKED_PHONE);
}

function missingParameters(nin: string, phone: string): boolean {
  return !nin || !phone;
}

function invalidParameters(nin: string, phone: string): boolean {
  return !isValidNin(nin) || !isValidPhone(phone);
}

export default requestOtp;
