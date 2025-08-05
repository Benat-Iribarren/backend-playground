import { userRepository } from '../../infrastructure/database/repository/userRepository';
import { Nin, Phone, User } from '../../domain/model/userType';
import { Hash } from '../../domain/model/hashType';
import { OtpServiceImpl as OtpService } from './OtpService';
import { Otp } from '../../domain/model/otpType';
import {
  userBlockedErrorMsg,
  userNotFoundErrorMsg,
  UserLoginErrors,
} from '../../domain/errors/userLoginErrors';

export async function processOtpRequest(
  user: User,
): Promise<UserLoginErrors | { hash: string; verificationCode: string }> {
  if (await isUserBlocked(user)) {
    return userBlockedErrorMsg;
  }

  if (await userNinNotExists(user.nin)) {
    return userNotFoundErrorMsg;
  }

  if (await userPhoneNotExists(user.phone)) {
    return { hash: '', verificationCode: '' };
  }

  const { generateHash, createOtp, saveOtp } = OtpService;
  const hash: Hash = generateHash();
  const verificationCode: Otp = await createOtp();
  await saveOtp(hash, verificationCode);

  return { hash: hash, verificationCode: verificationCode };
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
