import { OtpService } from '../../domain/interfaces/otpService';
import { Otp } from '../../domain/model/otpType';

export async function generateSixDigitCode(otpService: OtpService): Promise<string> {
  let result: Otp;
  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      result += randomIndex.toString();
    }
  } while (await otpService.otpCodeExists(result));
  return result;
}
