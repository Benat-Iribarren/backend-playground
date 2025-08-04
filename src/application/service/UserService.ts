import { userRepository } from '../../infrastructure/database/repository/userRepository';
import { Nin, Phone, User } from '../../domain/model/userType';
import { Hash } from '../../domain/model/hashType';
import { OtpServiceImpl as OtpService } from './OtpService';
import { Otp } from '../../domain/model/otpType';

const MESSAGES = {
  USER_BLOCKED: { error: 'User is blocked.'},
  USER_NOT_FOUND: { error: 'User not found.'},
};

export async function processOtpRequest(user: User) {
  if (await isUserBlocked(user)) {
    return MESSAGES.USER_BLOCKED;
  }

  if (await userPhoneNotExists(user.phone)) {
    return { hash: '', verificationCode: '' };
  }

  if (await userNinNotExists(user.nin)) {
    return MESSAGES.USER_NOT_FOUND;
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
