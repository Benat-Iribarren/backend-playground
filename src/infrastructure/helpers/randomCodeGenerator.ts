import { OtpStorage } from "../../domain/model/otpType";
import { Otp } from "../../domain/model/otpType";

export async function generateSixDigitCode(otpStorage: OtpStorage): Promise<string> {
  let result: Otp;
  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      result += randomIndex.toString();
    }
  } while (await otpStorage.otpCodeExists(result));
  return result;
}
