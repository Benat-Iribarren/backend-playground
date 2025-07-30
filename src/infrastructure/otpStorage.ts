import { Otp } from '../domain/model/otpType';
import { OtpStorage } from '../domain/interfaces/otpStorage';
import { Hash } from '../domain/model/hashType';
import { otpRepository } from './database/operations/otpOperations';

export const otpStorage: OtpStorage = {
  async saveOtp(hash: Hash, otp: Otp) {
    const expirationDateString = obtainOtpExpirationDate().toISOString();
    await otpRepository.saveOtpToDb(hash, otp, expirationDateString);
  },

  async otpCodeExists(otp: Otp): Promise<boolean> {
    const otpCodeExists = await otpRepository.otpCodeExistsInDb(otp);
    return otpCodeExists;
  },
  
  async hashCodeExists(hash: Hash): Promise<boolean> {
    const hashCodeExists = await otpRepository.hashCodeExistsInDb(hash);
    return hashCodeExists;
  },
  
  async deleteOtpFromHash(hash: Hash) {
    await otpRepository.deleteOtpFromHashCode(hash);
  },

  async otpExpired(hash: Hash, otp: Otp): Promise<boolean> {
    return (await otpStorage.otpMatchesHash(hash, otp)) && !(await isOtpValid(hash, otp));
  },
  
  async otpMatchesHash(hash: Hash, otp: Otp): Promise<boolean> {
    return (await otpRepository.getOtpByHash(hash)) === otp;
  },

};

const fiveMinutesInMilliseconds = 1000 * 60 * 5;
function obtainOtpExpirationDate(): Date {
  return new Date(Date.now() + fiveMinutesInMilliseconds);
}

async function isOtpValid(hash: Hash, otp: Otp): Promise<boolean> {
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
  return otp === undefined || !(await otpRepository.otpCodeExistsInDb(otp));
}
