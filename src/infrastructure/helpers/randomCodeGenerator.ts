import { CodeGenerator } from '../../domain/interfaces/codeGenerator';
import { VerificationCode } from '../../domain/model/Otp';

export const randomCodeGenerator: CodeGenerator = {
  generateSixDigitCode: async (): Promise<VerificationCode> => {
    let result: VerificationCode;

    result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 10);
      result += randomIndex.toString();
    }

    return result;
  },
};
