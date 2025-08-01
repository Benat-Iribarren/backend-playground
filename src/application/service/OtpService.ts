import { generateSixDigitCode } from '../../infrastructure/helpers/randomCodeGenerator';
import { generateRandomHash } from '../../infrastructure/helpers/randomHashGenerator';
import { OtpService } from '../../domain/interfaces/otpService';
import { otpRepository } from '../../infrastructure/database/repository/otpRepository';
import { obtainOtpExpirationDate } from '../../infrastructure/helpers/otpExpirationDateGenerator';
import { isOtpValid } from '../../infrastructure/helpers/otpValidator';

export const OtpServiceImpl: OtpService = {
  async createOtp() {
    return generateSixDigitCode(this);
  },
  async saveOtp(hash, otp) {
    const expirationDateString = obtainOtpExpirationDate().toISOString();
    await otpRepository.saveOtpToDb(hash, otp, expirationDateString);
  },
  async otpCodeExists(otp) {
    const otpCodeExists = await otpRepository.otpCodeExistsInDb(otp);
    return otpCodeExists;
  },
  async hashCodeExists(hash) {
    const hashCodeExists = await otpRepository.hashCodeExistsInDb(hash);
    return hashCodeExists;
  },
  async useOtpCode(hash) {
    await otpRepository.deleteOtpFromHashCode(hash);
  },
  async otpExpired(hash, otp) {
    const otpValid = await isOtpValid(hash, otp);
    const otpExired = !otpValid;
    return otpExired;
  },
  async otpMatchesHash(hash, otp) {
    return (await otpRepository.getOtpByHash(hash)) === otp;
  },
  generateHash() {
    return generateRandomHash();
  },
};
