import { FastifyInstance } from 'fastify';
import { verifyOtpSchema } from './schema';
import { Token } from '../../../../domain/model/token';
import { Hash, verificationCodeExists } from '../../../../domain/model/otp';
import {
  invalidHashOrCodeErrorStatusMsg,
  missingHashOrCodeErrorStatusMsg,
  VerifyOtpErrors,
} from '../../../../domain/errors/verifyOtpErrors';
import {
  hashCodeExists,
  processOtpVerificationRequest,
  verificationCodeMatchesHash,
} from '../../../../application/services/OtpService';
import { otpRepository } from '../../../database/repository/otpRepository';

const VERIFY_OTP_ENDPOINT = '/auth/verify-otp';

export const statusToMessage: { [K in VerifyOtpErrors]: string | object } = {
  MISSING_HASH_OR_CODE: { error: 'Missing hash or verification code.' },
  INVALID_HASH_OR_CODE: { error: 'Invalid hash or verification code.' },
  INCORRECT_HASH_OR_CODE: { error: 'Incorrect hash or verification code.' },
};

export const statusToCode: { [K in VerifyOtpErrors]: number } & {
  [key: string]: number;
} = {
  MISSING_HASH_OR_CODE: 400,
  INVALID_HASH_OR_CODE: 400,
  INCORRECT_HASH_OR_CODE: 400,
  SUCCESSFUL_RESPONSE: 200,
};

type VerificationResponse = VerifyOtpErrors | { token: Token };
type VerifyOtpBody = { hash: string; verificationCode: string };

async function verifyOtp(fastify: FastifyInstance) {
  fastify.post(VERIFY_OTP_ENDPOINT, verifyOtpSchema, async (request, reply) => {
    const { hash, verificationCode } = request.body as VerifyOtpBody;
    if (missingParameters(hash, verificationCode)) {
      return reply.status(400).send(statusToMessage[missingHashOrCodeErrorStatusMsg]);
    }

    if (await invalidParameters(hash, verificationCode)) {
      return reply.status(400).send(statusToMessage[invalidHashOrCodeErrorStatusMsg]);
    }

    const body = await processOtpVerificationRequest(otpRepository, { hash, verificationCode });

    if (incorrectParameters(body as VerificationResponse)) {
      return reply
        .status(statusToCode[body as VerifyOtpErrors])
        .send(statusToCode[body as VerifyOtpErrors]);
    }

    return reply.status(statusToCode.SUCCESSFUL_RESPONSE).send(body);
  });
}

function incorrectParameters(body: VerificationResponse): boolean {
  return typeof body !== 'object';
}

function missingParameters(hash: string, verificationCode: string): boolean {
  return !hash || !verificationCode;
}

async function invalidParameters(hash: string, verificationCode: string): Promise<boolean> {
  return (
    (await invalidHash(hash)) ||
    (await invalidVerificationCode(verificationCode)) ||
    !(await verificationCodeMatchesHash(otpRepository, { hash, verificationCode }))
  );
}

async function invalidHash(hash: string): Promise<boolean> {
  return !(await hashCodeExists(otpRepository, hash));
}

async function invalidVerificationCode(verificationCode: string): Promise<boolean> {
  const codeRegex = /^[0-9]{6}$/;
  return (
    !codeRegex.test(verificationCode) || !verificationCodeExists(otpRepository, verificationCode)
  );
}

export default verifyOtp;
