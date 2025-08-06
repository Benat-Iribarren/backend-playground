import { User, userNinNotExists, userPhoneNotExists, isUserBlocked } from '../../domain/model/user';
import { OtpServiceImpl as OtpService } from './OtpService';
import { Hash, Otp, VerificationCode } from '../../domain/model/otpType';
import {
  userBlockedErrorStatusMsg,
  userNotFoundErrorStatusMsg,
  UserLoginErrors,
} from '../../domain/errors/userLoginErrors';
import { UserRepository } from '../../domain/interfaces/userRespository';

export async function processOtpRequest(
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

  const { generateHash, createVerificationCode, saveOtp } = OtpService;
  const hash: Hash = generateHash();
  const verificationCode: VerificationCode = await createVerificationCode();
  const otp: Otp = { hash, verificationCode };
  await saveOtp(otp);

  return otp;
}
