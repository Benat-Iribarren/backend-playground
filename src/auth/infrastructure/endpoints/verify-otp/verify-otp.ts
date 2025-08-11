import { FastifyInstance } from 'fastify';
import { verifyOtpSchema } from './schema';
import { Token } from '../../../domain/model/Token';
import {
  invalidHashOrCodeErrorStatusMsg,
  missingHashOrCodeErrorStatusMsg,
  VerifyOtpErrors,
} from './errors';
import { processOtpVerificationRequest } from '../../../application/services/verifyOtpService';
import { invalidHash } from '../../../domain/helpers/validators/hashValidator';
import { invalidVerificationCode } from '../../../domain/helpers/validators/verificationCodeValidator';
import { TokenRepository } from '../../../domain/interfaces/repositories/TokenRepository';
import { OtpRepository } from '../../../domain/interfaces/repositories/OtpRepository';
import { TokenGenerator } from '../../../domain/interfaces/generators/TokenGenerator';

const VERIFY_OTP_ENDPOINT = '/auth/verify-otp';

export const statusToMessage: { [K in VerifyOtpErrors]: string | object } = {
  MISSING_HASH_OR_CODE: { error: 'Missing hash or verification code.' },
  INVALID_HASH_OR_CODE: { error: 'Invalid hash or verification code.' },
  OTP_NOT_FOUND: { error: 'Incorrect hash or verification code.' },
  EXPIRED_VERIFICATION_CODE: { error: 'Incorrect hash or verification code.' },
};

export const statusToCode: { [K in VerifyOtpErrors]: number } & {
  [key: string]: number;
} = {
  SUCCESSFUL: 201,
  MISSING_HASH_OR_CODE: 400,
  INVALID_HASH_OR_CODE: 400,
  OTP_NOT_FOUND: 401,
  EXPIRED_VERIFICATION_CODE: 401,
};

type VerificationResponse = VerifyOtpErrors | { token: Token };
type VerifyOtpBody = { hash: string; verificationCode: string };

interface VerifyOtpDependencies {
  tokenRepository: TokenRepository;
  otpRepository: OtpRepository;
  tokenGenerator: TokenGenerator;
}

function verifyOtp(dependencies: VerifyOtpDependencies) {
  return async function (fastify: FastifyInstance) {
    fastify.post(VERIFY_OTP_ENDPOINT, verifyOtpSchema, async (request, reply) => {
      const { hash, verificationCode } = request.body as VerifyOtpBody;

      if (missingParameters(hash, verificationCode)) {
        return reply
          .status(statusToCode[missingHashOrCodeErrorStatusMsg])
          .send(statusToMessage[missingHashOrCodeErrorStatusMsg]);
      }

      if (await invalidParameters(hash, verificationCode)) {
        return reply
          .status(statusToCode[invalidHashOrCodeErrorStatusMsg])
          .send(statusToMessage[invalidHashOrCodeErrorStatusMsg]);
      }

      const body = await processOtpVerificationRequest(
        dependencies.tokenRepository,
        dependencies.otpRepository,
        dependencies.tokenGenerator,
        { hash, verificationCode },
      );

      if (errorExists(body as VerificationResponse)) {
        return reply
          .status(statusToCode[body as VerifyOtpErrors])
          .send(statusToMessage[body as VerifyOtpErrors]);
      }

      return reply.status(statusToCode.SUCCESSFUL).send(body);
    });
  };
}

function errorExists(body: VerificationResponse): boolean {
  return typeof body !== 'object';
}

function missingParameters(hash: string, verificationCode: string): boolean {
  return !hash || !verificationCode;
}

async function invalidParameters(hash: string, verificationCode: string): Promise<boolean> {
  return invalidHash(hash) || invalidVerificationCode(verificationCode);
}

export default verifyOtp;
