import { FastifyInstance } from 'fastify';
import { verifyOtpSchema } from './schema';
import { Token } from '../../../../domain/model/token';
import { Hash, Otp, VerificationCode } from '../../../../domain/model/otpType';
import {
  invalidHashOrCodeErrorStatusMsg,
  missingHashOrCodeErrorStatusMsg,
  VerifyOtpErrors,
} from '../../../../domain/errors/verifyOtpErrors';
import { OtpServiceImpl as OtpService } from '../../../../application/services/OtpService';

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
    const otp: Otp = request.body as {
      hash: Hash;
      verificationCode: VerificationCode;
    };

    if (missingParameters(otp)) {
      return reply.status(400).send(statusToMessage[missingHashOrCodeErrorStatusMsg]);
    }

    if (await invalidParameters(otp)) {
      return reply.status(400).send(statusToMessage[invalidHashOrCodeErrorStatusMsg]);
    }

    const body = await OtpService.processOtpVerificationRequest(otp);

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

function missingParameters(otp: Otp): boolean {
  return !otp.hash || !otp.verificationCode;
}

async function invalidParameters(otp: Otp): Promise<boolean> {
  return (
    (await invalidHash(otp.hash)) ||
    (await invalidVerificationCode(otp.verificationCode)) ||
    !(await OtpService.verificationCodeMatchesHash(otp))
  );
}

async function invalidHash(hash: Hash): Promise<boolean> {
  return !(await OtpService.hashCodeExists(hash));
}

async function invalidVerificationCode(verificationCode: VerificationCode): Promise<boolean> {
  const codeRegex = /^[0-9]{6}$/;
  return !codeRegex.test(verificationCode) || !OtpService.verificationCodeExists(verificationCode);
}

export default verifyOtp;
