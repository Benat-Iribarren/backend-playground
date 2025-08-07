import { OtpRepository } from '../interfaces/repositories/otpRepository';

export type VerificationCode = string;
export type Hash = string;

export type Otp = {
  verificationCode: VerificationCode;
  hash: Hash;
};

export async function verificationCodeMatchesHash(otpRepository: OtpRepository, otp: Otp) {
  return (await otpRepository.getVerificationCodeByHash(otp.hash)) === otp.verificationCode;
}
