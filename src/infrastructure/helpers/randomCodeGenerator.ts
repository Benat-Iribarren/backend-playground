import { OtpServiceImpl as OtpService } from '../../application/services/OtpService';
import { VerificationCode } from '../../domain/model/otpType';

export async function generateSixDigitCode(): Promise<VerificationCode> {
  let result: VerificationCode;

  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      result += randomIndex.toString();
    }
  } while (await OtpService.verificationCodeExists(result));

  return result;
}
