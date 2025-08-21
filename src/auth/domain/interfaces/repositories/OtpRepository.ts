import { Hash, Otp, VerificationCode } from '../../model/Otp';
import { UserId } from '@common/domain/model/UserParameters';

export interface OtpRepository {
  saveOtp(otp: Otp): Promise<void>;
  getOtp(verificationCode: VerificationCode, hash: Hash): Promise<Otp | null>;
  deleteOtp(userId: UserId): Promise<void>;
}
