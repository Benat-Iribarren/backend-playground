import { Hash, Otp, VerificationCode } from '../../model/otp';
import { UserId } from '../../model/user';
export interface OtpRepository {
  saveOtp(userId: UserId, otp: Otp, expirationDate: string): Promise<void>;
  verificationCodeExists(verificationCode: VerificationCode): Promise<boolean>;
  hashCodeExists(hash: Hash): Promise<boolean>;
  getVerificationCodeByHash(hash: Hash): Promise<VerificationCode | null>;
  getExpirationDate(hash: Hash): Promise<string | null>;
  deleteOtpFromHashCode(hash: Hash): Promise<void>;
}
