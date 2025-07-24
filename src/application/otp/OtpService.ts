import { otpStorage } from '../../infrastructure/otpStorage';
import { generateSixDigitCode } from '../../domain/helpers/randomCodeGenerator';
import { Otp } from '../../domain/model/otpType';
import { HashCode } from '../../domain/model/hashCode';

export const generateOtp: (hash: HashCode) => Otp = (hash: HashCode) => {
  const otpCode = generateSixDigitCode(otpStorage);
  otpStorage.saveOtp(hash, otpCode);
  return otpCode;
};