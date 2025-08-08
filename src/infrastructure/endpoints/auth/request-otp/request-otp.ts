import { FastifyInstance } from 'fastify';
import { requestOtpSchema } from './schema';
import { isValidNin } from '../../../../domain/helpers/validators/ninValidator';
import { isValidPhone } from '../../../../domain/helpers/validators/phoneValidator';
import { processOtpRequest } from '../../../../application/services/requestOtpService';
import { UserLoginErrors } from '../../../../domain/errors/userLoginErrors';
import {
  invalidNinOrPhoneErrorStatusMsg,
  missingNinOrPhoneErrorStatusMsg,
  RequestOtpErrors,
} from '../../../../domain/errors/requestOtpErrors';
import { otpRepository } from '../../../database/repository/otpRepository';
import { userRepository } from '../../../database/repository/userRepository';
import { randomCodeGenerator } from '../../../helpers/generators/randomCodeGenerator';
import { randomHashGenerator } from '../../../helpers/generators/randomHashGenerator';
import { phoneValidator } from '../../../helpers/validators/phoneValidator';

const REQUEST_OTP_ENDPOINT = '/auth/request-otp';

const statusToMessage: { [K in RequestOtpErrors]: string | object } & {
  [key: string]: string | object;
} = {
  MISSING_NIN_OR_PHONE: { error: 'Missing nin or phone number.' },
  INVALID_NIN_OR_PHONE: { error: 'Invalid nin or phone number.' },
  USER_BLOCKED: { error: 'User is blocked.' },
  USER_NOT_FOUND: { error: 'User not found.' },
  PHONE_NOT_EXISTS: '',
};

const statusToCode: { [K in RequestOtpErrors]: number } & { [key: string]: number } = {
  MISSING_NIN_OR_PHONE: 400,
  INVALID_NIN_OR_PHONE: 400,
  USER_BLOCKED: 403,
  USER_NOT_FOUND: 404,
  EMPTY_HASH: 200,
  NOT_EMPTY_HASH: 200,
};

type OtpResponse = RequestOtpErrors | { hash: string; verificationCode: string };
type RequestOtpBody = { nin: string; phone: string };

async function requestOtp(fastify: FastifyInstance) {
  fastify.post(REQUEST_OTP_ENDPOINT, requestOtpSchema, async (request, reply) => {
    const { nin, phone } = request.body as RequestOtpBody;

    if (missingParameters(nin, phone)) {
      return reply
        .status(statusToCode[missingNinOrPhoneErrorStatusMsg])
        .send(statusToMessage[missingNinOrPhoneErrorStatusMsg]);
    }

    if (invalidParameters(nin, phone)) {
      return reply
        .status(statusToCode[invalidNinOrPhoneErrorStatusMsg])
        .send(statusToMessage[invalidNinOrPhoneErrorStatusMsg]);
    }

    const body = await processOtpRequest(
      otpRepository,
      userRepository,
      randomCodeGenerator,
      randomHashGenerator,
      phoneValidator,
      nin,
      phone,
    );

    if (errorExists(body)) {
      return reply
        .status(statusToCode[body as UserLoginErrors])
        .send(statusToMessage[body as UserLoginErrors]);
    }

    if (phoneDoesNotExists(body)) {
      return reply.status(statusToCode.EMPTY_HASH).send(body);
    }

    return reply.status(statusToCode.NOT_EMPTY_HASH).send(body);
  });
}

function phoneDoesNotExists(body: OtpResponse): boolean {
  return typeof body === 'object' && body !== null && 'hash' in body && body.hash === '';
}

function errorExists(body: UserLoginErrors | { hash: string; verificationCode: string }): boolean {
  return typeof body !== 'object';
}

function missingParameters(nin: string, phone: string): boolean {
  return !nin || !phone;
}

function invalidParameters(nin: string, phone: string): boolean {
  return !isValidNin(nin) || !isValidPhone(phone);
}

export default requestOtp;
