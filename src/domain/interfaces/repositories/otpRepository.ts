import { Hash, Otp, VerificationCode } from '../../model/otp';
export interface OtpRepository {
  saveOtpToDb(otp: Otp, expirationDate: string): Promise<void>;
  verificationCodeExistsInDb(verificationCode: VerificationCode): Promise<boolean>;
  hashCodeExistsInDb(hash: Hash): Promise<boolean>;
  getVerificationCodeByHash(hash: Hash): Promise<VerificationCode | null>;
  getExpirationDate(hash: Hash): Promise<string | null>;
  deleteOtpFromHashCode(hash: Hash): Promise<void>;
}
