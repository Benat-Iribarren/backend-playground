import { saveOtp } from './OtpService';
import {
  createVerificationCode,
  generateHash,
  Hash,
  Otp,
  VerificationCode,
} from '../../domain/model/otp';
import { User, userNinNotExists, userPhoneNotExists, isUserBlocked } from '../../domain/model/user';
import {
  userBlockedErrorStatusMsg,
  userNotFoundErrorStatusMsg,
  UserLoginErrors,
} from '../../domain/errors/userLoginErrors';
import { randomHashGenerator } from '../../infrastructure/helpers/randomHashGenerator';
import { randomCodeGenerator } from '../../infrastructure/helpers/randomCodeGenerator';
import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { UserRepository } from '../../domain/interfaces/repositories/userRespository';

export async function processOtpRequest(
  otpRepository: OtpRepository,
  userRepository: UserRepository,
  user: User,
): Promise<UserLoginErrors | { hash: string; verificationCode: string }> {
  if (await isUserBlocked(userRepository, user)) {
    return userBlockedErrorStatusMsg;
  }

  if (await userNinNotExists(userRepository, user.nin)) {
    return userNotFoundErrorStatusMsg;
  }

  if (await userPhoneNotExists(userRepository, user.phone)) {
    return { hash: '', verificationCode: '' };
  }

  const hash: Hash = generateHash(randomHashGenerator);
  const verificationCode: VerificationCode = await createVerificationCode(randomCodeGenerator);
  const otp: Otp = { hash, verificationCode };
  await saveOtp(otpRepository, otp);

  return otp;
}
