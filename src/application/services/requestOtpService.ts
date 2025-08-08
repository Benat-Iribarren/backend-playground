import {
  isUserBlocked,
  Nin,
  Phone,
  userNotExists as userAndIdNotExists,
  UserId,
  UserWithId,
} from '../../domain/model/User';
import {
  userBlockedErrorStatusMsg,
  userNotFoundErrorStatusMsg,
  UserLoginErrors,
} from '../../domain/errors/userLoginErrors';
import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { UserRepository } from '../../domain/interfaces/repositories/userRespository';
import { CodeGenerator } from '../../domain/interfaces/codeGenerator';
import { HashGenerator } from '../../domain/interfaces/hashGenerator';
import { Hash, Otp, VerificationCode } from '../../domain/model/Otp';
import { PhoneValidator } from '../../domain/interfaces/phoneValidator';

type OtpWithUserIdWithoutExpiration = Omit<Otp, 'expirationDate'>;

export async function processOtpRequest(
  otpRepository: OtpRepository,
  userRepository: UserRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  phoneValidator: PhoneValidator,
  nin: Nin,
  phone: Phone,
): Promise<UserLoginErrors | OtpWithUserIdWithoutExpiration> {
  const userWithId: UserWithId | null = await userRepository.getUser(nin, phone);

  if (userAndIdNotExists(userWithId)) {
    return userNotFoundErrorStatusMsg;
  }
  const { id: userId, ...user } = userWithId;
  if (isUserBlocked(user)) {
    return userBlockedErrorStatusMsg;
  }

  if (userPhoneNotExists(phoneValidator, user.phone)) {
    return { hash: '', verificationCode: '' };
  }

  return getOtp(otpRepository, codeGenerator, hashGenerator, userId);
}

async function getOtp(
  otpRepository: OtpRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  userId: UserId,
): Promise<OtpWithUserIdWithoutExpiration> {
  const hash: Hash = hashGenerator.generateHash();
  const verificationCode: VerificationCode = await codeGenerator.generateSixDigitCode();

  await saveOtp(otpRepository, userId, hash, verificationCode);

  const otpWithUserId: OtpWithUserIdWithoutExpiration = {
    hash,
    verificationCode,
  };

  return otpWithUserId;
}

function userPhoneNotExists(phoneValidator: PhoneValidator, phone: Phone) {
  return phoneValidator.validatePhone(phone);
}

async function saveOtp(
  otpRepository: OtpRepository,
  userId: UserId,
  hash: Hash,
  verificationCode: VerificationCode,
) {
  const expirationDateString = obtainOtpExpirationDate().toISOString();
  const otp: Otp = { hash, verificationCode, expirationDate: expirationDateString };
  await otpRepository.saveOtp(userId, otp);
}

function obtainOtpExpirationDate(): Date {
  const fiveMinutesInMilliseconds = 1000 * 60 * 5;
  return new Date(Date.now() + fiveMinutesInMilliseconds);
}
