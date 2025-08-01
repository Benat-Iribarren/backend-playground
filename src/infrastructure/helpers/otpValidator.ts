import { Hash } from '../../domain/model/hashType';
import { Otp } from '../../domain/model/otpType';
import { otpRepository } from '../database/operations/otpOperations';

export async function isOtpValid(hash: Hash, otp: Otp): Promise<boolean> {
  if (await otpNotFound(otp)) return false;

  const otpFromDb = await otpRepository.getOtpByHash(hash);
  if (otpCodesDoNotMatch(otpFromDb, otp)) return false;

  const expirationDate = await otpRepository.getExpirationDate(hash);
  if (expirationDate === null) return false;

  return isExpirationDateValid(expirationDate);
}

function otpCodesDoNotMatch(otpFromDb: string | null, otp: string) {
  return otpFromDb === null || otpFromDb !== otp;
}

async function otpNotFound(otp: Otp | undefined): Promise<boolean> {
  return otp === undefined || !(await otpRepository.otpCodeExistsInDb(otp));
}

function isExpirationDateValid(expirationDate: string | undefined): boolean {
  return expirationDate !== undefined && expirationDate > new Date().toISOString();
}
