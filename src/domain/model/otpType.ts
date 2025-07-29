import { HashCode } from '../../domain/model/hashCode';
export type OtpStorage = {
  saveOtp: (hash: string, otp: Otp) => void;
  otpCodeExists: (otp: Otp) => Promise<boolean>;
  hashCodeExists: (hash: HashCode) => Promise<boolean>;
  deleteOtpFromHash: (hash: HashCode) => void;
  otpExpired: (hash: HashCode, otp: Otp) => Promise<boolean>;
  otpMatchesHash: (hash: HashCode, otp: Otp) => Promise<boolean>;
};
export type Otp = string;
