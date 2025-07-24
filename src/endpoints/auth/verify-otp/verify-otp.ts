import { FastifyInstance } from 'fastify';
import { verifyOtpSchema } from './schema';
import { generateToken } from '../../../application/token/TokenService';

const VERIFY_OTP_ENDPOINT = '/auth/verify-otp';
const MESSAGES = {
  MISSING_HASH_OR_CODE: 'Missing hash or verification code.',
  INVALID_HASH_OR_CODE: 'Invalid hash or verification code.',
  INCORRECT_HASH_OR_CODE: 'Incorrect hash or verification code.',
  SUCCESSFULL_RESULT: 'User logged in successfully',
};

const VALID_HASH = '1234567890';
const VALID_CODE = '123456';

async function verifyOtp(fastify: FastifyInstance) {
  fastify.post(VERIFY_OTP_ENDPOINT, verifyOtpSchema, async (request, reply) => {
    const { hash, verificationCode } = request.body as {
      hash: string;
      verificationCode: string;
    };

    if (missingParameters(hash, verificationCode)) {
      return reply.status(400).send({ error: MESSAGES.MISSING_HASH_OR_CODE });
    }

    if (invalidParameters(hash, verificationCode)) {
      return reply.status(400).send({ error: MESSAGES.INVALID_HASH_OR_CODE });
    }

    return reply.status(200).send({ token: generateToken(hash) });
  });
}

function missingParameters(hash: string, verificationCode: string): boolean {
  return !hash || !verificationCode;
}

function invalidParameters(hash: string, verificationCode: string): boolean {
  return invalidHash(hash) || invalidCode(verificationCode);
}

function invalidHash(hash: string): boolean {
  return hash !== VALID_HASH;
}

function invalidCode(verificationCode: string): boolean {
  const codeRegex = /^[0-9]{6}$/;
  return !codeRegex.test(verificationCode) || verificationCode !== VALID_CODE;
}

export default verifyOtp;
