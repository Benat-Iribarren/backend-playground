import { codeExists } from '../../infrastructure/otpStore';

export function generateSixDigitCode(phone: string): string {
  let result: string;
  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      result += randomIndex.toString();
    }
  } while (codeExists(phone, result));
  return result;
}
