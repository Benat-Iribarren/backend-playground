import { Hash, Otp, VerificationCode } from '../../model/Otp';
import { UserId } from '../../model/User';
export interface OtpRepository {
  saveOtp(userId: UserId, otp: Otp): Promise<void>;
  getOtp(verificationCode: VerificationCode, hash: Hash): Promise<void>;
  deleteOtpFromHashCode(hash: Hash): Promise<void>;
}
