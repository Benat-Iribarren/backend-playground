import { Hash } from '../model/hashType';
import { Otp } from '../model/otpType';

export interface OtpRepository {
  saveOtpToDb(hash: Hash, otp: Otp, expirationDate: string): Promise<void>;
  otpCodeExistsInDb(otp: Otp): Promise<boolean>;
  hashCodeExistsInDb(hash: Hash): Promise<boolean>;
  getOtpByHash(hash: Hash): Promise<Otp | null>;
  getExpirationDate(hash: Hash): Promise<string | null>;
  deleteOtpFromHashCode(hash: Hash): Promise<void>;
}
