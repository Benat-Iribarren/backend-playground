import { Hash, Otp, VerificationCode } from '../../model/Otp';

export interface OtpRepository {
  saveOtp(otp: Otp): Promise<void>;
  getOtp(verificationCode: VerificationCode, hash: Hash): Promise<Otp | null>;
  deleteOtpFromHashCode(hash: Hash): Promise<void>;
}
