import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { UserId } from '../../domain/model/user';
import { Hash, Otp, VerificationCode } from '../../domain/model/otp';
import { CodeGenerator } from '../../domain/interfaces/codeGenerator';
import { HashGenerator } from '../../domain/interfaces/hashGenerator';

export async function getOtp(
  otpRepository: OtpRepository,
  codeGenerator: CodeGenerator,
  hashGenerator: HashGenerator,
  userId: UserId,
): Promise<Otp> {
  const hash: Hash = hashGenerator.generateHash();
  const verificationCode: VerificationCode = await codeGenerator.generateSixDigitCode();
  const otp: Otp = { hash, verificationCode };

  await saveOtp(otpRepository, userId, otp);

  return otp;
}

async function saveOtp(otpRepository: OtpRepository, userId: UserId, otp: Otp) {
  const expirationDateString = obtainOtpExpirationDate().toISOString();
  await otpRepository.saveOtp(userId, otp, expirationDateString);
}

const obtainOtpExpirationDate = (): Date => {
  const fiveMinutesInMilliseconds = 1000 * 60 * 5;
  return new Date(Date.now() + fiveMinutesInMilliseconds);
};

export const useOtpCode = async (otpRepository: OtpRepository, otp: Otp) => {
  await otpRepository.deleteOtpFromHashCode(otp.hash);
};
