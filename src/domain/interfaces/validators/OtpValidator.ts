import { Hash, VerificationCode } from '../../model/Otp';

export interface OtpValidator {
  isOtpValid(hash: Hash, verificationCode: VerificationCode): Promise<boolean>;
}
