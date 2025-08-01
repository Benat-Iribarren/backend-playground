import { FastifyInstance } from 'fastify';
import { requestOtpSchema } from './schema';
import { isValidNin } from '../../../domain/helpers/validators/ninValidator';
import { isValidPhone } from '../../../domain/helpers/validators/phoneValidator';
import { User, Phone, Nin } from '../../../domain/model/userType';
import { Hash } from '../../../domain/model/hashType';
import { Otp } from '../../../domain/model/otpType';
import { OtpServiceImpl as OtpService } from '../../../application/service/OtpService';
import { UserServiceImpl as UserService } from '../../../application/service/UserService';

const REQUEST_OTP_ENDPOINT = '/auth/request-otp';
const MESSAGES = {
  MISSING_NIN_OR_PHONE: 'Missing nin or phone number.',
  INVALID_NIN_OR_PHONE: 'Invalid nin or phone number.',
  USER_BLOCKED: 'User is blocked.',
  USER_NOT_FOUND: 'User not found.',
};

async function requestOtp(fastify: FastifyInstance) {
  fastify.post(REQUEST_OTP_ENDPOINT, requestOtpSchema, async (request, reply) => {
    const { nin, phone } = request.body as User;

    if (missingParameters(nin, phone)) {
      return reply.status(400).send({ error: MESSAGES.MISSING_NIN_OR_PHONE });
    }

    if (invalidParameters(nin, phone)) {
      return reply.status(400).send({ error: MESSAGES.INVALID_NIN_OR_PHONE });
    }

    if (await blockedUser({ nin, phone })) {
      return reply.status(403).send({ error: MESSAGES.USER_BLOCKED });
    }
    
    if (await userPhoneDoesNotExists(phone)) {
      return reply.status(200).send({ hash: '', verificationCode: '' });
    }
    
    if (await userNinExists(nin)) {
      const hash: Hash = OtpService.generateHash();
      const verificationCode: Otp = await OtpService.createOtp();
      await OtpService.saveOtp(hash, verificationCode);

      return reply.status(200).send({ hash: hash, verificationCode: verificationCode });
    }

    return reply.status(404).send({ error: MESSAGES.USER_NOT_FOUND });
  });
}

async function userPhoneDoesNotExists(phone: Phone): Promise<Boolean> {
  return !(await UserService.userPhoneExists(phone));
}

async function blockedUser(user: User): Promise<boolean> {
  return await UserService.userBlocked(user);
}

async function userNinExists(nin: Nin): Promise<boolean> {
  return await UserService.userNinExists(nin);
}

function missingParameters(nin: string, phone: string): boolean {
  return !nin || !phone;
}

function invalidParameters(nin: string, phone: string): boolean {
  return !isValidNin(nin) || !isValidPhone(phone);
}

export default requestOtp;
