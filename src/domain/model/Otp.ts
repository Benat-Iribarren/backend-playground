import { OtpRepository } from '../interfaces/repositories/OtpRepository';

export type VerificationCode = string;
export type Hash = string;
export type ExpirationDate = string;

export type Otp = {
  verificationCode: VerificationCode;
  hash: Hash;
  expirationDate: ExpirationDate;
};

export async function verificationCodeMatchesHash(
  otpRepository: OtpRepository,
  hash: Hash,
  verificationCode: VerificationCode,
) {
  return (await otpRepository.getVerificationCodeByHash(hash)) === verificationCode;
}
