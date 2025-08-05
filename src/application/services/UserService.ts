import { Nin, Phone, User } from '../../domain/model/userType';
import { OtpServiceImpl as OtpService } from './OtpService';
import { Hash, Otp, VerificationCode } from '../../domain/model/otpType';
import {
  userBlockedErrorStatusMsg,
  userNotFoundErrorStatusMsg,
  UserLoginErrors,
} from '../../domain/errors/userLoginErrors';
import {
  userNinNotExists,
  isUserBlocked,
  userPhoneNotExists,
} from '../../domain/model/userType';

export async function processOtpRequest(
  user: User,
): Promise<UserLoginErrors | { hash: string; verificationCode: string }> {
  if (await isUserBlocked(user)) {
    return userBlockedErrorStatusMsg;
  }

  if (await userNinNotExists(user.nin)) {
    return userNotFoundErrorStatusMsg;
  }

  if (await userPhoneNotExists(user.phone)) {
    return { hash: '', verificationCode: '' };
  }

  const { generateHash, createVerificationCode, saveOtp } = OtpService;
  const hash: Hash = generateHash();
  const verificationCode: VerificationCode = await createVerificationCode();
  const otp: Otp = { hash, verificationCode };
  await saveOtp(otp);

  return otp;
}
