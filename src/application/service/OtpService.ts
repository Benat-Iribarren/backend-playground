import { otpStorage } from '../../infrastructure/otpStorage';
import { generateSixDigitCode } from '../../infrastructure/helpers/randomCodeGenerator';
import { Otp } from '../../domain/model/otpType';
import { HashCode } from '../../domain/model/hashCode';
import { generateRandomHash } from '../../infrastructure/helpers/randomHashGenerator';

export const createOtp = async (): Promise<Otp> => generateSixDigitCode(otpStorage);

export const saveOtp = otpStorage.saveOtp;

export const otpCodeExists = otpStorage.otpCodeExists;

export const hashCodeExists = otpStorage.hashCodeExists;

export const useOtpCode = otpStorage.deleteOtp;

export const otpExpired = otpStorage.otpExpired;

export const otpMatchesHash = otpStorage.otpMatchesHash;

export const generateHash: () => HashCode = () => {
  return generateRandomHash();
};
