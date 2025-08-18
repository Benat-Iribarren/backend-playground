import { FastifyInstance } from 'fastify';
import { requestOtpSchema } from './schema';
import { isValidNin } from '../../../domain/helpers/validators/ninValidator';
import { isValidPhone } from '../../../domain/helpers/validators/phoneValidator';
import { processOtpRequest } from '../../../application/services/requestOtpService';
import {
  invalidNinOrPhoneErrorStatusMsg,
  missingNinOrPhoneErrorStatusMsg,
  RequestOtpErrors,
} from './errors';
import { OtpRepository } from '../../../domain/interfaces/repositories/OtpRepository';
import { UserRepository } from '../../../domain/interfaces/repositories/UserRespository';
import { CodeGenerator } from '../../../domain/interfaces/generators/CodeGenerator';
import { HashGenerator } from '../../../domain/interfaces/generators/HashGenerator';
import { PhoneValidator } from '../../../domain/interfaces/validators/PhoneValidator';

export const REQUEST_OTP_ENDPOINT = '/auth/otp';

const statusToMessage: { [K in RequestOtpErrors]: string | object } & {
  [key: string]: string | object;
} = {
  MISSING_NIN_OR_PHONE: { error: 'Missing nin or phone number.' },
  INVALID_NIN_OR_PHONE: { error: 'Invalid nin or phone number.' },
  UNAVAILABLE_PHONE: { error: 'Incorrect nin or phone number.' },
  USER_NOT_FOUND: { error: 'Incorrect nin or phone number.' },
  USER_BLOCKED: { error: 'User is blocked.' },
};

const statusToCode: { [K in RequestOtpErrors]: number } & { [key: string]: number } = {
  SUCCESSFUL: 201,
  MISSING_NIN_OR_PHONE: 400,
  INVALID_NIN_OR_PHONE: 400,
  UNAVAILABLE_PHONE: 401,
  USER_NOT_FOUND: 401,
  USER_BLOCKED: 403,
};

type RequestOtpBody = { nin: string; phone: string };

interface RequestOtpDependencies {
  otpRepository: OtpRepository;
  userRepository: UserRepository;
  codeGenerator: CodeGenerator;
  hashGenerator: HashGenerator;
  phoneValidator: PhoneValidator;
}

function requestOtp(dependencies: RequestOtpDependencies) {
  return async function (fastify: FastifyInstance) {
    fastify.post(REQUEST_OTP_ENDPOINT, requestOtpSchema, async (request, reply) => {
      try {
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
          dependencies.otpRepository,
          dependencies.userRepository,
          dependencies.codeGenerator,
          dependencies.hashGenerator,
          dependencies.phoneValidator,
          { nin, phone },
        );

        if (errorExists(body)) {
          return reply
            .status(statusToCode[body as RequestOtpErrors])
            .send(statusToMessage[body as RequestOtpErrors]);
        }

        return reply.status(statusToCode.SUCCESSFUL).send(body);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal Server Error' });
      }
    });
  };
}

function errorExists(body: RequestOtpErrors | { hash: string; verificationCode: string }): boolean {
  return typeof body !== 'object';
}

function missingParameters(nin: string, phone: string): boolean {
  return !nin || !phone;
}

function invalidParameters(nin: string, phone: string): boolean {
  return !isValidNin(nin) || !isValidPhone(phone);
}

export default requestOtp;
