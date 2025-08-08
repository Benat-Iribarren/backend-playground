import { Hash, VerificationCode } from '../../domain/model/Otp';
import { otpRepository } from '../database/repository/otpRepository';

export async function isOtpValid({
  hash,
  verificationCode,
}: {
  hash: Hash;
  verificationCode: VerificationCode;
}): Promise<boolean> {
  const otp = await otpRepository.getOtp(verificationCode, hash);
  if (!otp) {
    return false;
  }

  return isExpirationDateValid(otp.expirationDate);
}

function isExpirationDateValid(expirationDate: string | undefined): boolean {
  return expirationDate !== undefined && expirationDate > new Date().toISOString();
}
