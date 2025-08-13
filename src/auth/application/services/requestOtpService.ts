import {
  isUserBlocked,
  Nin,
  Phone,
  userNotExists as userAndIdNotExists,
  UserId,
  UserWithId,
} from '../../domain/model/User';
import {
  UserBlockedError,
  userBlockedErrorStatusMsg,
  UserNotFoundError,
  userNotFoundErrorStatusMsg,
  UserPhoneUnavailableError,
  userPhoneUnavailableForSmsErrorStatusMsg,
} from '../../domain/errors/userLoginErrors';
import { OtpRepository } from '../../domain/interfaces/repositories/OtpRepository';
import { UserRepository } from '../../domain/interfaces/repositories/UserRespository';
import { CodeGenerator } from '../../domain/interfaces/generators/CodeGenerator';
import { HashGenerator } from '../../domain/interfaces/generators/HashGenerator';
import { Hash, Otp, VerificationCode } from '../../domain/model/Otp';
import { PhoneValidator } from '../../domain/interfaces/validators/PhoneValidator';

type OtpResponse = Pick<Otp, 'hash' | 'verificationCode'>;

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
  nin: Nin,
  phone: Phone,
): Promise<RequestOtpServiceErrors | OtpResponse> {
  const userWithId: UserWithId | null = await userRepository.getUser(nin, phone);

  if (userAndIdNotExists(userWithId)) {
    return userNotFoundErrorStatusMsg;
  }

  const { id: userId, ...user } = userWithId;
  if (isUserBlocked(user)) {
    return userBlockedErrorStatusMsg;
  }

  if (userPhoneUnavailable(phoneValidator, user.phone)) {
    return userPhoneUnavailableForSmsErrorStatusMsg;
  }

  return getOtp(otpRepository, codeGenerator, hashGenerator, userId);
}

async function getOtp(
  otpRepository: OtpRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  userId: UserId,
): Promise<OtpResponse> {
  const hash: Hash = hashGenerator.generateHash();
  const verificationCode: VerificationCode = await codeGenerator.generateSixDigitCode();

  await saveOtp(otpRepository, userId, hash, verificationCode);

  return { hash, verificationCode };
}

function userPhoneUnavailable(phoneValidator: PhoneValidator, phone: Phone) {
  return !phoneValidator.validatePhone(phone);
}

async function saveOtp(
  otpRepository: OtpRepository,
  userId: UserId,
  hash: Hash,
  verificationCode: VerificationCode,
) {
  const expirationDateString = obtainOtpExpirationDate().toISOString();
  const otp: Otp = { userId, hash, verificationCode, expirationDate: expirationDateString };
  await otpRepository.saveOtp(otp);
}

function obtainOtpExpirationDate(): Date {
  const fiveMinutesInMilliseconds = 1000 * 60 * 5;
  return new Date(Date.now() + fiveMinutesInMilliseconds);
}
