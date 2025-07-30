import { Otp } from '../model/otpType';
import { Hash } from '../model/hashType';

export interface OtpStorage  {
  saveOtp(hash: string, otp: Otp): void;
  otpCodeExists(otp: Otp): Promise<boolean>;
  hashCodeExists(hash: Hash): Promise<boolean>;
  deleteOtpFromHash(hash: Hash): void;
  otpExpired(hash: Hash, otp: Otp): Promise<boolean>;
  otpMatchesHash(hash: Hash, otp: Otp): Promise<boolean>;
};
