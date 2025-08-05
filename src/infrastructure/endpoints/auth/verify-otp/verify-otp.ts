import { FastifyInstance } from 'fastify';
import { verifyOtpSchema } from './schema';
import { OtpServiceImpl as OtpService } from '../../../../application/services/OtpService';
import { Hash } from '../../../../domain/model/hashType';
import { Token } from '../../../../domain/model/token';
import { Otp } from '../../../../domain/model/otpType';
import {
  invalidHashOrCodeErrorStatusMsg,
  missingHashOrCodeErrorStatusMsg,
  VerifyOtpErrors,
} from '../../../../domain/errors/verifyOtpErrors';

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

async function verifyOtp(fastify: FastifyInstance) {
  fastify.post(VERIFY_OTP_ENDPOINT, verifyOtpSchema, async (request, reply) => {
    const { hash, verificationCode } = request.body as {
      hash: Hash;
      verificationCode: Otp;
    };

    if (missingParameters(hash, verificationCode)) {
      return reply.status(400).send(statusToMessage[missingHashOrCodeErrorStatusMsg]);
    }

    if (await invalidParameters(hash, verificationCode)) {
      return reply.status(400).send(statusToMessage[invalidHashOrCodeErrorStatusMsg]);
    }

    const body = await OtpService.processOtpVerificationRequest(hash, verificationCode);

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
