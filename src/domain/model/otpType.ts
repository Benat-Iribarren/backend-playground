import { HashCode } from '../../domain/model/hashCode';
export type OtpStorage = {
  saveOtp: (phone: string, otp: Otp) => void;
  otpCodeExists: (otp: Otp) => boolean;
  hashCodeExists: (hash: HashCode) => boolean;
  deleteOtp: (hash: HashCode) => void;
  otpExpired: (hash: HashCode, otp: Otp) => boolean;
  otpMatchesHash: (hash: HashCode, otp: Otp) => boolean;
};
export type Otp = string;