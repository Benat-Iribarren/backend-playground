import { CodeGenerator } from '../interfaces/codeGenerator';
import { HashGenerator } from '../interfaces/hashGenerator';
import { OtpRepository } from '../interfaces/repositories/otpRepository';

export type VerificationCode = string;
export type Hash = string;

export type Otp = {
  verificationCode: VerificationCode;
  hash: Hash;
};

export async function createVerificationCode(codeGenerator: CodeGenerator) {
  return codeGenerator.generateSixDigitCode();
}

export function generateHash(hashGenerator: HashGenerator) {
  return hashGenerator.generateHash();
}

export async function verificationCodeExists(
  otpRepository: OtpRepository,
  verificationCode: VerificationCode,
) {
  return await otpRepository.verificationCodeExistsInDb(verificationCode);
}
