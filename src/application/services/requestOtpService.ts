import {
  isUserBlocked,
  Nin,
  Phone,
  userNotExists as userAndIdNotExists,
  UserId,
  userPhoneNotExists,
  UserWithId,
} from '../../domain/model/user';
import {
  userBlockedErrorStatusMsg,
  userNotFoundErrorStatusMsg,
  UserLoginErrors,
} from '../../domain/errors/userLoginErrors';
import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { UserRepository } from '../../domain/interfaces/repositories/userRespository';
import { CodeGenerator } from '../../domain/interfaces/codeGenerator';
import { HashGenerator } from '../../domain/interfaces/hashGenerator';
import { Hash, Otp, VerificationCode } from '../../domain/model/otp';

export async function processOtpRequest(
  otpRepository: OtpRepository,
  userRepository: UserRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  nin: Nin,
  phone: Phone,
): Promise<UserLoginErrors | { hash: string; verificationCode: string }> {
  const userWithId: UserWithId | null = await userRepository.getUser(nin, phone);

  if (userAndIdNotExists(userWithId)) {
    return userNotFoundErrorStatusMsg;
  }

  const { id: userId, ...user } = userWithId;
  if (isUserBlocked(user)) {
    return userBlockedErrorStatusMsg;
  }

  if (userPhoneNotExists(user.phone)) {
    return { hash: '', verificationCode: '' };
  }

  return getOtp(otpRepository, codeGenerator, hashGenerator, userId);
}

export async function getOtp(
  otpRepository: OtpRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  userId: UserId,
): Promise<Otp> {
  const hash: Hash = hashGenerator.generateHash();
  const verificationCode: VerificationCode = await codeGenerator.generateSixDigitCode();
  const otp: Otp = { hash, verificationCode };

  await saveOtp(otpRepository, userId, otp);

  return otp;
}

async function saveOtp(otpRepository: OtpRepository, userId: UserId, otp: Otp) {
  const expirationDateString = obtainOtpExpirationDate().toISOString();
  await otpRepository.saveOtp(userId, otp, expirationDateString);
}

const obtainOtpExpirationDate = (): Date => {
  const fiveMinutesInMilliseconds = 1000 * 60 * 5;
  return new Date(Date.now() + fiveMinutesInMilliseconds);
};

export const useOtpCode = async (otpRepository: OtpRepository, otp: Otp) => {
  await otpRepository.deleteOtpFromHashCode(otp.hash);
};
