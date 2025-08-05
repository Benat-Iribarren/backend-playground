import { generateSixDigitCode } from '../../infrastructure/helpers/randomCodeGenerator';
import { generateRandomHash } from '../../infrastructure/helpers/randomHashGenerator';
import { otpRepository } from '../../infrastructure/database/repository/otpRepository';
import { obtainOtpExpirationDate } from '../../infrastructure/helpers/otpExpirationDateGenerator';
import { isOtpValid } from '../../infrastructure/helpers/otpValidator';
import { Otp } from '../../domain/model/otpType';
import { Hash } from '../../domain/model/hashType';
import { Token } from '../../domain/model/token';
import { ERROR_MESSAGES } from '../../infrastructure/endpoints/auth/verify-otp/verify-otp';
import { generateToken, saveToken } from '../../domain/model/token';

export const OtpServiceImpl = {
  async processOtpVerificationRequest(
    hash: Hash,
    verificationCode: Otp,
  ): Promise<{ error?: string; token?: Token }> {
    if (await otpExpired(hash, verificationCode)) {
      useOtpCode(hash);
      return ERROR_MESSAGES.INCORRECT_HASH_OR_CODE;
    }

    useOtpCode(hash);
    const token: Token = generateToken(hash);
    await saveToken(token);

    return { token };
  },

  async otpCodeExists(otp: Otp) {
    const otpCodeExists = await otpRepository.otpCodeExistsInDb(otp);
    return otpCodeExists;
  },

  async otpMatchesHash(hash: Hash, otp: Otp) {
    return (await otpRepository.getOtpByHash(hash)) === otp;
  },

  async hashCodeExists(hash: Hash) {
    const hashCodeExists = await otpRepository.hashCodeExistsInDb(hash);
    return hashCodeExists;
  },

  async createOtp() {
    return generateSixDigitCode();
  },

  async saveOtp(hash: Hash, otp: Otp) {
    const expirationDateString = obtainOtpExpirationDate().toISOString();
    await otpRepository.saveOtpToDb(hash, otp, expirationDateString);
  },

  generateHash() {
    return generateRandomHash();
  },
};

const useOtpCode = async (hash: Hash) => {
  await otpRepository.deleteOtpFromHashCode(hash);
};

const otpExpired = async (hash: Hash, otp: Otp) => {
  const otpValid = await isOtpValid(hash, otp);
  const otpExired = !otpValid;
  return otpExired;
};
