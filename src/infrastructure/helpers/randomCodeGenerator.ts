import { CodeGenerator } from '../../domain/interfaces/codeGenerator';
import { VerificationCode, verificationCodeExists } from '../../domain/model/otp';
import { otpRepository } from '../database/repository/otpRepository';

export const randomCodeGenerator: CodeGenerator = {
  generateSixDigitCode: async (): Promise<VerificationCode> => {
    let result: VerificationCode;

    do {
      result = '';
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * 10);
        result += randomIndex.toString();
      }
    } while (await verificationCodeExists(otpRepository, result));

    return result;
  },
};
