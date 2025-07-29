import { FastifyInstance } from 'fastify';
import { verifyOtpSchema } from './schema';
import { OtpServiceImpl as OtpService } from '../../../application/service/OtpService';
import { HashCode } from '../../../domain/model/hashCode';
import { generateToken } from '../../../application/service/TokenService';

const VERIFY_OTP_ENDPOINT = '/auth/verify-otp';
const MESSAGES = {
  MISSING_HASH_OR_CODE: 'Missing hash or verification code.',
  INVALID_HASH_OR_CODE: 'Invalid hash or verification code.',
  INCORRECT_HASH_OR_CODE: 'Incorrect hash or verification code.',
  SUCCESSFULL_RESULT: 'User logged in successfully',
};

async function verifyOtp(fastify: FastifyInstance) {
  fastify.post(VERIFY_OTP_ENDPOINT, verifyOtpSchema, async (request, reply) => {
    const { hash, verificationCode } = request.body as {
      hash: HashCode;
      verificationCode: string;
    };

    if (missingParameters(hash, verificationCode)) {
      return reply.status(400).send({ error: MESSAGES.MISSING_HASH_OR_CODE });
    }

    if (await invalidParameters(hash, verificationCode)) {
      return reply.status(400).send({ error: MESSAGES.INVALID_HASH_OR_CODE });
    }

    if (await OtpService.otpExpired(hash, verificationCode)) {
      OtpService.useOtpCode(hash);
      return reply.status(400).send({ error: MESSAGES.INCORRECT_HASH_OR_CODE });
    }

    OtpService.useOtpCode(hash);
    return reply.status(200).send({ token: generateToken(hash) });
  });
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
  return !codeRegex.test(verificationCode) || !(await OtpService.otpCodeExists(verificationCode));
}

export default verifyOtp;
