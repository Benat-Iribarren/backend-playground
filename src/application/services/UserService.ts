import { userRepository } from '../../infrastructure/database/repository/userRepository';
import { Nin, Phone, User } from '../../domain/model/userType';
import { OtpServiceImpl as OtpService } from './OtpService';
import { Hash, Otp, VerificationCode } from '../../domain/model/otpType';
import {
  userBlockedErrorStatusMsg,
  userNotFoundErrorStatusMsg,
  UserLoginErrors,
} from '../../domain/errors/userLoginErrors';

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
async function userNinNotExists(nin: Nin) {
  const exists = await userRepository.ninExistsInDB(nin);
  return !exists;
}
async function isUserBlocked(user: User) {
  return await userRepository.userIsBlocked(user);
}
async function userPhoneNotExists(phone: Phone) {
  const exists = await userRepository.phoneExistsInDB(phone);
  return !exists;
}
