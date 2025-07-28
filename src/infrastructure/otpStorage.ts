import { Otp, OtpStorage } from '../domain/model/otpType';
import { HashCode } from '../domain/model/hashCode';
import { otpRepository } from './database/operations/otpOperations';

export const otpStorage: OtpStorage = {
  saveOtp,
  otpCodeExists,
  hashCodeExists,
  deleteOtp,
  otpExpired,
  otpMatchesHash,
};

async function saveOtp(hash: HashCode, otp: Otp) {
  const expirationDateString = obtainOtpExpirationDate().toISOString();
  await otpRepository.saveOtpToDb(hash, otp, expirationDateString);
}

const fiveMinutesInMilliseconds = 1000 * 60 * 5;
function obtainOtpExpirationDate(): Date {
  return new Date(Date.now() + fiveMinutesInMilliseconds);
}

async function otpCodeExists(otp: Otp): Promise<boolean> {
  const otpCodeExists = await otpRepository.otpCodeExistsInDb(otp);
  return otpCodeExists;
}

async function hashCodeExists(hash: HashCode): Promise<boolean> {
  const hashCodeExists = await otpRepository.hashCodeExistsInDb(hash);
  return hashCodeExists;
}

async function otpExpired(hash: HashCode, otp: Otp): Promise<boolean> {
  return (await otpMatchesHash(hash, otp)) && !(await isOtpValid(hash, otp));
}

async function otpMatchesHash(hash: HashCode, otp: Otp): Promise<boolean> {
  return (await hashCodeExists(hash)) && (await otpRepository.getOtpByHash(hash)) === otp;
}

async function isOtpValid(hash: HashCode, otp: Otp): Promise<boolean> {
  if (await otpNotFound(otp)) return false;

  const otpFromDb = await otpRepository.getOtpByHash(hash);
  if (otpFromDb === null || otpFromDb !== otp) return false;

  const expirationDate = await otpRepository.getExpirationDate(hash);
  if (expirationDate === null) return false;

  return isExpirationDateValid(expirationDate);
}

async function isExpirationDateValid(expirationDate: string | undefined): Promise<boolean> {
  return expirationDate !== undefined && expirationDate > new Date().toISOString();
}

async function otpNotFound(otp: Otp | undefined): Promise<boolean> {
  return otp === undefined || !await otpRepository.otpCodeExistsInDb(otp);
}

async function deleteOtp(hash: HashCode) {
  await otpRepository.deleteOtpFromHashCode(hash);
}
