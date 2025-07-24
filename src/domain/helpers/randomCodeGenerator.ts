import { OtpStorage } from "../model/otpType";
import { Otp } from "../model/otpType";

export function generateSixDigitCode(otpStorage: OtpStorage): string {
  let result: Otp;
  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      result += randomIndex.toString();
    }
  } while (otpStorage.codeExists(result));
  return result;
}
