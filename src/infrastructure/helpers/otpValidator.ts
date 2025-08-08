import { Hash, VerificationCode } from '../../domain/model/Otp';
import { otpRepository } from '../database/repository/otpRepository';

export async function isOtpValid({
  hash,
  verificationCode,
}: {
  hash: Hash;
  verificationCode: VerificationCode;
}): Promise<boolean> {
  if (await verificationCodeNotFound(verificationCode)) {
    return false;
  }

  const verificationCodeFromDb = await otpRepository.getVerificationCodeByHash(hash);
  if (verificationCodeDoNotMatch(verificationCodeFromDb, verificationCode)) {
    return false;
  }

  const expirationDate = await otpRepository.getExpirationDate(hash);
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
