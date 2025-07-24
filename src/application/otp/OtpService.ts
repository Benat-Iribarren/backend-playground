import { otpStorage } from '../../infrastructure/otpStorage';
import { generateSixDigitCode } from '../../domain/helpers/randomCodeGenerator';
import { Otp } from '../../domain/model/otpType';
import { User } from '../../domain/model/userType';

export const generateOtp: (phone: keyof User) => Otp = (phone: keyof User) => {
  const otpCode = generateSixDigitCode(otpStorage);
  otpStorage.saveOtp(phone, otpCode);
  return otpCode;
};
