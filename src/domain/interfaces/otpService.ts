import { Otp } from '../model/otpType';
import { Hash } from '../model/hashType';

export interface OtpService {
  createOtp(): Promise<Otp>;
  saveOtp(hash: Hash, otp: Otp): Promise<void>;
  otpCodeExists(otp: Otp): Promise<boolean>;
  hashCodeExists(hash: Hash): Promise<boolean>;
  useOtpCode(hash: Hash): Promise<void>;
  otpExpired(hash: Hash, otp: Otp): Promise<boolean>;
  otpMatchesHash(hash: Hash, otp: Otp): Promise<boolean>;
  generateHash(): Hash;
}
