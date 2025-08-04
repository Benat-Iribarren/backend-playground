import { FastifyInstance } from 'fastify';
import { requestOtpSchema } from './schema';
import { isValidNin } from '../../../../domain/helpers/validators/ninValidator';
import { isValidPhone } from '../../../../domain/helpers/validators/phoneValidator';
import { User } from '../../../../domain/model/userType';
import { processOtpRequest } from '../../../../application/service/UserService';

const REQUEST_OTP_ENDPOINT = '/auth/request-otp';
const MESSAGES = {
  MISSING_NIN_OR_PHONE: { error: 'Missing nin or phone number.' },
  INVALID_NIN_OR_PHONE: { error: 'Invalid nin or phone number.' },
  USER_BLOCKED: { error: 'User is blocked.' },
  USER_NOT_FOUND: { error: 'User not found.' },
  PHONE_NOT_EXISTS: '',
};
const messageToCode = {
  MISSING_NIN_OR_PHONE: 400,
  INVALID_NIN_OR_PHONE: 400,
  USER_BLOCKED: 403,
  USER_NOT_FOUND: 404,
  EMPTY_HASH: 200,
  NOT_EMPTY_HASH: 200,
};
type OtpResponse = { error: string } | { hash: string; verificationCode: string };

async function requestOtp(fastify: FastifyInstance) {
  fastify.post(REQUEST_OTP_ENDPOINT, requestOtpSchema, async (request, reply) => {
    const { nin, phone } = request.body as User;

    if (missingParameters(nin, phone)) {
      return reply.status(messageToCode.MISSING_NIN_OR_PHONE).send(MESSAGES.MISSING_NIN_OR_PHONE);
    }

    if (invalidParameters(nin, phone)) {
      return reply.status(messageToCode.INVALID_NIN_OR_PHONE).send(MESSAGES.INVALID_NIN_OR_PHONE);
    }

    const body = await processOtpRequest({ nin, phone });

    if (body === MESSAGES.USER_BLOCKED) {
      return reply.status(messageToCode.USER_BLOCKED).send(body);
    }

    if (body === MESSAGES.USER_NOT_FOUND) {
      return reply.status(messageToCode.USER_NOT_FOUND).send(body);
    }

    if (phoneDoesNotExists(body)) {
      return reply.status(messageToCode.EMPTY_HASH).send(body);
    }

    return reply.status(messageToCode.NOT_EMPTY_HASH).send(body);
  });
}

function phoneDoesNotExists(body: OtpResponse) {
  return 'hash' in body && body.hash === '';
}

function missingParameters(nin: string, phone: string): boolean {
  return !nin || !phone;
}

function invalidParameters(nin: string, phone: string): boolean {
  return !isValidNin(nin) || !isValidPhone(phone);
}

export default requestOtp;
