import { Hash, Otp, VerificationCode } from '../../model/Otp';
import { UserId } from '../../model/User';
export interface OtpRepository {
  saveOtp(userId: UserId, otp: Otp): Promise<void>;
  verificationCodeExists(verificationCode: VerificationCode): Promise<boolean>;
  hashCodeExists(hash: Hash): Promise<boolean>;
  getVerificationCodeByHash(hash: Hash): Promise<VerificationCode | null>;
  getExpirationDate(hash: Hash): Promise<string | null>;
  deleteOtpFromHashCode(hash: Hash): Promise<void>;
  getUserId(hash: Hash): Promise<number | null>;
}
