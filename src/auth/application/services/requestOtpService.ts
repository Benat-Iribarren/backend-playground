import { Nin, Phone, UserId } from '@common/domain/model/UserParameters';
import { UserAuth } from '@auth/domain/model/UserAuth';
import {
  UserBlockedError,
  userBlockedErrorStatusMsg,
  UserNotFoundError,
  userNotFoundErrorStatusMsg,
  UserPhoneUnavailableError,
  userPhoneUnavailableForSmsErrorStatusMsg,
} from '../../domain/errors/userLoginErrors';
import { OtpRepository } from '../../domain/interfaces/repositories/OtpRepository';
import { UserRepository } from '@src/user/domain/interfaces/repositories/UserRespository';
import { CodeGenerator } from '../../domain/interfaces/generators/CodeGenerator';
import { HashGenerator } from '../../domain/interfaces/generators/HashGenerator';
import {
  ExpirationDate,
  generateOtpExpirationDate,
  Hash,
  Otp,
  VerificationCode,
} from '../../domain/model/Otp';
import { PhoneValidator } from '../../domain/interfaces/validators/PhoneValidator';

type RequestOtpInput = {
  nin: Nin;
  phone: Phone;
};
type RequestOtpResponse = Pick<Otp, 'hash' | 'verificationCode'>;

export type RequestOtpServiceErrors =
  | UserPhoneUnavailableError
  | UserBlockedError
  | UserNotFoundError;

export async function processOtpRequest(
  otpRepository: OtpRepository,
  userRepository: UserRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  phoneValidator: PhoneValidator,
  input: RequestOtpInput,
): Promise<RequestOtpServiceErrors | RequestOtpResponse> {
  const { nin, phone } = input;
  const user: UserAuth | null = await userRepository.getUser(nin);

  if (userDoesntExist(user)) {
    return userNotFoundErrorStatusMsg;
  }

  const { id: userId } = user;
  if (userIsBlocked(user)) {
    return userBlockedErrorStatusMsg;
  }
  const userPhoneExist: boolean = await userRepository.isUserPhoneRegistered(user.id, phone);

  if (userPhoneDoesNotExist(userPhoneExist)) {
    return userNotFoundErrorStatusMsg;
  }
  if (userPhoneUnavailable(phoneValidator, phone)) {
    return userPhoneUnavailableForSmsErrorStatusMsg;
  }

  return getOtp(otpRepository, codeGenerator, hashGenerator, userId);
}

async function getOtp(
  otpRepository: OtpRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  userId: UserId,
): Promise<RequestOtpResponse> {
  const otp: Otp = generateOtp(userId, codeGenerator, hashGenerator);
  otpRepository.saveOtp(otp);

  const { hash, verificationCode } = otp;
  return { hash, verificationCode };
}

function userPhoneDoesNotExist(userPhoneExist: boolean): boolean {
  return !userPhoneExist;
}

function userPhoneUnavailable(phoneValidator: PhoneValidator, phone: Phone) {
  return !phoneValidator.validatePhone(phone);
}

function generateOtp(
  userId: UserId,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
): Otp {
  const hash: Hash = hashGenerator.generateHash();
  const verificationCode: VerificationCode = codeGenerator.generateSixDigitCode();
  const expirationDateString: ExpirationDate = generateOtpExpirationDate();
  const otp: Otp = { userId, hash, verificationCode, expirationDate: expirationDateString };
  return otp;
}

export function userDoesntExist(user: UserAuth | null): user is null {
  return user === null;
}

export function userIsBlocked(user: UserAuth): boolean {
  return user.isBlocked;
}
