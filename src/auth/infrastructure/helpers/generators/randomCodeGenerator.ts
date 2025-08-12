import { CodeGenerator } from '../../../domain/interfaces/generators/CodeGenerator';
import { VerificationCode } from '../../../domain/model/Otp';

export const codeGenerator: CodeGenerator = {
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
