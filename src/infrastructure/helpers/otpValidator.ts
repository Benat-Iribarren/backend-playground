import { Otp, VerificationCode } from '../../domain/model/otp';
import { otpRepository } from '../database/repository/otpRepository';

export async function isOtpValid(otp: Otp): Promise<boolean> {
  if (await verificationCodeNotFound(otp.verificationCode)) {
    return false;
  }

  const verificationCodeFromDb = await otpRepository.getVerificationCodeByHash(otp.hash);
  if (verificationCodeDoNotMatch(verificationCodeFromDb, otp.verificationCode)) {
    return false;
  }

  const expirationDate = await otpRepository.getExpirationDate(otp.hash);
  if (expirationDate === null) {
    return false;
  }

  return isExpirationDateValid(expirationDate);
}

function verificationCodeDoNotMatch(
  verificationCodeFromDb: string | null,
  verificationCode: VerificationCode,
) {
  return verificationCodeFromDb === null || verificationCodeFromDb !== verificationCode;
}

async function verificationCodeNotFound(
  verificationCode: VerificationCode | undefined,
): Promise<boolean> {
  return (
    verificationCode === undefined ||
    !(await otpRepository.verificationCodeExists(verificationCode))
  );
}

function isExpirationDateValid(expirationDate: string | undefined): boolean {
  return expirationDate !== undefined && expirationDate > new Date().toISOString();
}
