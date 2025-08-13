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
import {
  ExpirationDate,
  generateOtpExpirationDate,
  Hash,
  Otp,
  VerificationCode,
} from '../../domain/model/Otp';
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
  const otp: Otp = generateOtp(userId, codeGenerator, hashGenerator);
  otpRepository.saveOtp(otp);

  const { hash, verificationCode } = otp;
  return { hash, verificationCode };
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
