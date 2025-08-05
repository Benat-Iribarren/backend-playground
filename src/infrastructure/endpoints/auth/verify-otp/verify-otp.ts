import { FastifyInstance } from 'fastify';
import { verifyOtpSchema } from './schema';
import { OtpServiceImpl as OtpService } from '../../../../application/services/OtpService';
import { Hash } from '../../../../domain/model/hashType';
import { Token } from '../../../../domain/model/token';
import { Otp } from '../../../../domain/model/otpType';

const VERIFY_OTP_ENDPOINT = '/auth/verify-otp';

export const ERROR_MESSAGES = {
  MISSING_HASH_OR_CODE: { error: 'Missing hash or verification code.' },
  INVALID_HASH_OR_CODE: { error: 'Invalid hash or verification code.' },
  INCORRECT_HASH_OR_CODE: { error: 'Incorrect hash or verification code.' },
};

export const MESSAGES_CODE = {
  MISSING_HASH_OR_CODE: 400,
  INVALID_HASH_OR_CODE: 400,
  INCORRECT_HASH_OR_CODE: 400,
  SUCCESSFUL_RESPONSE: 200,
};

async function verifyOtp(fastify: FastifyInstance) {
  fastify.post(VERIFY_OTP_ENDPOINT, verifyOtpSchema, async (request, reply) => {
    const { hash, verificationCode } = request.body as {
      hash: Hash;
      verificationCode: Otp;
    };

    if (missingParameters(hash, verificationCode)) {
      return reply.status(400).send(ERROR_MESSAGES.MISSING_HASH_OR_CODE);
    }

    if (await invalidParameters(hash, verificationCode)) {
      return reply.status(400).send(ERROR_MESSAGES.INVALID_HASH_OR_CODE);
    }

    const body = await OtpService.processOtpVerificationRequest(hash, verificationCode);

    if (incorrectParameters(body)) {
      return reply
        .status(MESSAGES_CODE.INCORRECT_HASH_OR_CODE)
        .send(MESSAGES_CODE.INCORRECT_HASH_OR_CODE);
    }

    return reply.status(MESSAGES_CODE.SUCCESSFUL_RESPONSE).send(body);
  });
}

function incorrectParameters(body: { error?: string; token?: Token }) {
  return body === ERROR_MESSAGES.INCORRECT_HASH_OR_CODE.error;
}

function missingParameters(hash: string, verificationCode: string): boolean {
  return !hash || !verificationCode;
}

async function invalidParameters(hash: string, verificationCode: string): Promise<boolean> {
  return (
    (await invalidHash(hash)) ||
    (await invalidCode(verificationCode)) ||
    !(await OtpService.otpMatchesHash(hash, verificationCode))
  );
}

async function invalidHash(hash: string): Promise<boolean> {
  return !(await OtpService.hashCodeExists(hash));
}

async function invalidCode(verificationCode: string): Promise<boolean> {
  const codeRegex = /^[0-9]{6}$/;
  return !codeRegex.test(verificationCode) || !OtpService.otpCodeExists(verificationCode);
}

export default verifyOtp;
