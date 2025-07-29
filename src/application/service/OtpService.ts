import { otpStorage } from '../../infrastructure/otpStorage';
import { generateSixDigitCode } from '../../infrastructure/helpers/randomCodeGenerator';
import { generateRandomHash } from '../../infrastructure/helpers/randomHashGenerator';
import { OtpService } from '../../domain/interfaces/otpService';

export const OtpServiceImpl: OtpService = {
  async createOtp() {
    return generateSixDigitCode(otpStorage);
  },
  async saveOtp(hash, otp) {
    return otpStorage.saveOtp(hash, otp);
  },
  async otpCodeExists(otp) {
    return otpStorage.otpCodeExists(otp);
  },
  async hashCodeExists(hash) {
    return otpStorage.hashCodeExists(hash);
  },
  async useOtpCode(hash) {
    return otpStorage.deleteOtpFromHash(hash);
  },
  async otpExpired(hash, otp) {
    return otpStorage.otpExpired(hash, otp);
  },
  async otpMatchesHash(hash, otp) {
    return otpStorage.otpMatchesHash(hash, otp);
  },
  generateHash() {
    return generateRandomHash();
  },
};
