import { FastifyInstance } from 'fastify';
import { otpCodeCreationSchema } from './schema';
import { isValidNin } from '../utils/validators/ninValidator';
import { isValidPhone } from '../utils/validators/phoneValidator';
import { User } from '../../domain/userType';
import { generateSixDigitCode } from '../utils/randomCodeGenerator';

const OTP_CODE_CREATION_ENDPOINT = '/login/otp/code';
const MESSAGES = {
  INVALID_OR_MISSING_NIN_OR_PHONE: 'Invalid or missing nin or phone number.',
};
const INCORRECT_PHONE_NUMBER = '546534546';

async function otpCodeCreation(fastify: FastifyInstance) {
  fastify.post(OTP_CODE_CREATION_ENDPOINT, otpCodeCreationSchema, async (request, reply) => {
    const { nin, phone } = request.body as User;
    
    if (invalidOrMissingParameters(nin, phone)) {
      return reply.status(400).send({ error: MESSAGES.INVALID_OR_MISSING_NIN_OR_PHONE });
    }

    if (incorrectPhoneNumber(phone)) {
      return reply.status(200).send({ verificationCode: "" });
    }
    const VERIFICATION_CODE = generateSixDigitCode();
    return reply.status(200).send({ verificationCode: VERIFICATION_CODE });
  });
}
 
function incorrectPhoneNumber(phone: string): boolean {
    return phone === INCORRECT_PHONE_NUMBER;
}

function invalidOrMissingParameters(nin: string, phone: string): boolean {
  return !nin || !phone || !isValidNin(nin) || !isValidPhone(phone);
}

export default otpCodeCreation;
