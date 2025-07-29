import { Otp } from '../model/otpType';
import { HashCode } from '../model/hashCode';

export interface OtpService {
  createOtp(): Promise<Otp>;
  saveOtp(hash: HashCode, otp: Otp): Promise<void>;
  otpCodeExists(otp: Otp): Promise<boolean>;
  hashCodeExists(hash: HashCode): Promise<boolean>;
  useOtpCode(hash: HashCode): Promise<void>;
  otpExpired(hash: HashCode, otp: Otp): Promise<boolean>;
  otpMatchesHash(hash: HashCode, otp: Otp): Promise<boolean>;
  generateHash(): HashCode;
}
