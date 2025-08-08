import {
  isUserBlocked,
  Nin,
  Phone,
  userNotExists as userAndIdNotExists,
  UserId,
  userPhoneNotExists,
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
import { Hash, Otp, OtpWithUserId, VerificationCode } from '../../domain/model/Otp';

type OtpWithUserIdWithoutExpiration = Omit<OtpWithUserId, 'expirationDate'>;

export async function processOtpRequest(
  otpRepository: OtpRepository,
  userRepository: UserRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
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

  if (userPhoneNotExists(user.phone)) {
    return { hash: '', verificationCode: '', userId: -1 };
  }

  return getOtp(otpRepository, codeGenerator, hashGenerator, userId);
}

export async function getOtp(
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
    userId,
  };

  return otpWithUserId;
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

const obtainOtpExpirationDate = (): Date => {
  const fiveMinutesInMilliseconds = 1000 * 60 * 5;
  return new Date(Date.now() + fiveMinutesInMilliseconds);
};
