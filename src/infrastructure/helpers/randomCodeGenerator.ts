import { OtpServiceImpl as OtpService } from '../../application/services/OtpService';
import { Otp } from '../../domain/model/otpType';

export async function generateSixDigitCode(): Promise<Otp> {
  let result: Otp;

  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      result += randomIndex.toString();
    }
  } while (await OtpService.otpCodeExists(result));

  return result;
}
