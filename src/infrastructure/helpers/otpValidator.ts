import { Hash, VerificationCode } from '../../domain/model/Otp';
import { otpRepository } from '../database/repository/otpRepository';

export async function isOtpValid({
  expirationDate: string,
}: {
  hash: Hash;
  verificationCode: VerificationCode;
}): Promise<boolean> {}

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
