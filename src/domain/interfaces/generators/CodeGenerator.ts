import { VerificationCode } from '../../model/Otp';

export interface CodeGenerator {
  generateSixDigitCode(): Promise<VerificationCode>;
}
