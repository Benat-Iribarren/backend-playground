import { OtpValidator } from '../../../domain/interfaces/validators/OtpValidator';
import { Hash, VerificationCode } from '../../../domain/model/Otp';
import { otpRepository } from '../../database/repository/otpRepository';

export const otpValidator: OtpValidator = {
  isOtpValid: async (hash: Hash, verificationCode: VerificationCode): Promise<boolean> => {
    const otp = await otpRepository.getOtp(verificationCode, hash);
    if (!otp) {
      return false;
    }
    return otp.expirationDate > new Date().toISOString();
  },
};
