import { HashCode } from '../model/hashCode';
import { Otp } from '../model/otpType';

export interface OtpRepository {
  saveOtpToDb(hash: HashCode, otp: Otp, expirationDate: string): Promise<void>;
  otpCodeExistsInDb(otp: Otp): Promise<boolean>;
  hashCodeExistsInDb(hash: HashCode): Promise<boolean>;
  getOtpByHash(hash: HashCode): Promise<Otp | null>;
  getExpirationDate(hash: HashCode): Promise<string | null>;
  deleteOtpFromHashCode(hash: HashCode): Promise<void>;
}
