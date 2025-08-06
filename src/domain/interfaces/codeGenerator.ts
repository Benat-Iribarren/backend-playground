import { VerificationCode } from '../model/otp';

export interface CodeGenerator {
  generateSixDigitCode(): Promise<VerificationCode>;
}
