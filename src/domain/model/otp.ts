import { OtpRepository } from '../interfaces/repositories/otpRepository';
import { UserId } from './user';

export type VerificationCode = string;
export type Hash = string;

export type Otp = {
  verificationCode: VerificationCode;
  hash: Hash;
};

export type OtpWithUserId = {
  verificationCode: VerificationCode;
  hash: Hash;
  userId: UserId;
}

export async function verificationCodeMatchesHash(otpRepository: OtpRepository, otp: Otp) {
  return (await otpRepository.getVerificationCodeByHash(otp.hash)) === otp.verificationCode;
}
