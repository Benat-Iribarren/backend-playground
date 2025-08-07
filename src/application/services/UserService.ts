import { saveOtp } from './OtpService';
import { Hash, Otp, VerificationCode } from '../../domain/model/otp';
import {
  isUserBlocked,
  Nin,
  Phone,
  User,
  userNotExists as userAndIdNotExists,
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

export async function processOtpRequest(
  otpRepository: OtpRepository,
  userRepository: UserRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  nin: Nin,
  phone: Phone,
): Promise<UserLoginErrors | { hash: string; verificationCode: string }> {
  const userWithId: UserWithId | null  = await userRepository.getUser(nin, phone);

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

  const hash: Hash = hashGenerator.generateHash();
  const verificationCode: VerificationCode = await codeGenerator.generateSixDigitCode();
  const otp: Otp = { hash, verificationCode };

  await saveOtp(otpRepository, userId, otp);
  return otp;
}
