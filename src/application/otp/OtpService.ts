import { otpStorage } from '../../infrastructure/otpStorage';
import { generateSixDigitCode } from '../../domain/helpers/randomCodeGenerator';
import { Otp } from '../../domain/model/otpType';
import { HashCode } from '../../domain/model/hashCode';
import { generateRandomHash } from '../../domain/helpers/randomHashGenerator';

export const generateOtp: (hash: HashCode) => Otp = (hash: HashCode) => {
  const otpCode = generateSixDigitCode(otpStorage);
  otpStorage.saveOtp(hash, otpCode);
  return otpCode;
};

export const otpCodeExists = otpStorage.otpCodeExists;

export const hashCodeExists = otpStorage.hashCodeExists;

export const useOtpCode = otpStorage.deleteOtp;

export const otpExpired = otpStorage.otpExpired;

export const otpMatchesHash = otpStorage.otpMatchesHash;

export const generateHash: () => HashCode = () => {
  return generateRandomHash();
};
