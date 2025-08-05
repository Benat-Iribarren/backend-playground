import { generateSixDigitCode } from '../../infrastructure/helpers/randomCodeGenerator';
import { generateRandomHash } from '../../infrastructure/helpers/randomHashGenerator';
import { otpRepository } from '../../infrastructure/database/repository/otpRepository';
import { obtainOtpExpirationDate } from '../../infrastructure/helpers/otpExpirationDateGenerator';
import { isOtpValid } from '../../infrastructure/helpers/otpValidator';
import { Hash, Otp, VerificationCode } from '../../domain/model/otpType';
import { Token } from '../../domain/model/token';
import { generateToken, saveToken } from '../../domain/model/token';
import {
  IncorrectHashOrCodeError,
  incorrectHashOrCodeErrorStatusMsg,
} from '../../domain/errors/verifyOtpErrors';

export const OtpServiceImpl = {
  async processOtpVerificationRequest(
    otp: Otp,
  ): Promise<IncorrectHashOrCodeError | { token?: Token }> {
    if (await otpExpired(otp)) {
      useOtpCode(otp);
      return incorrectHashOrCodeErrorStatusMsg;
    }

    useOtpCode(otp);
    const token: Token = generateToken(otp.hash);
    await saveToken(token);

    return { token };
  },

  async verificationCodeExists(verificationCode: VerificationCode) {
    const otpCodeExists = await otpRepository.verificationCodeExistsInDb(verificationCode);
    return otpCodeExists;
  },

  async verificationCodeMatchesHash(otp: Otp) {
    return (await otpRepository.getVerificationCodeByHash(otp.hash)) === otp.verificationCode;
  },

  async hashCodeExists(hash: Hash) {
    const hashCodeExists = await otpRepository.hashCodeExistsInDb(hash);
    return hashCodeExists;
  },

  async createVerificationCode() {
    return generateSixDigitCode();
  },

  async saveOtp(otp: Otp) {
    const expirationDateString = obtainOtpExpirationDate().toISOString();
    await otpRepository.saveOtpToDb(otp, expirationDateString);
  },

  generateHash() {
    return generateRandomHash();
  },
};

const useOtpCode = async (otp: Otp) => {
  await otpRepository.deleteOtpFromHashCode(otp.hash);
};

const otpExpired = async (otp: Otp) => {
  const otpValid = await isOtpValid(otp);
  const otpExired = !otpValid;
  return otpExired;
};
