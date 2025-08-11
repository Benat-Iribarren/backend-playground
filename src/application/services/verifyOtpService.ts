import { Otp } from '../../domain/model/Otp';
import { Token } from '../../domain/model/Token';
import { TokenRepository } from '../../domain/interfaces/repositories/TokenRepository';
import { UserId } from '../../domain/model/User';
import { TokenGenerator } from '../../domain/interfaces/generators/TokenGenerator';
import { OtpRepository } from '../../domain/interfaces/repositories/OtpRepository';
import {
  expiredVerificationCodeErrorStatusMsg,
  incorrectHashOrCodeErrorStatusMsg,
  OtpLoginErrors,
} from '../../domain/errors/otpLoginError';

type VerifyInput = Omit<Otp, 'expirationDate' | 'userId'>;

export async function processOtpVerificationRequest(
  tokenRepository: TokenRepository,
  otpRepository: OtpRepository,
  tokenGenerator: TokenGenerator,
  input: VerifyInput,
): Promise<OtpLoginErrors | { token: Token }> {
  const otp: Otp | null = await otpRepository.getOtp(input.verificationCode, input.hash);

  if (!otp) {
    return incorrectHashOrCodeErrorStatusMsg;
  }

  otpRepository.deleteOtpFromHashCode(input.hash);

  if (isOtpExpired(otp)) {
    return expiredVerificationCodeErrorStatusMsg;
  }

  const token: Token = tokenGenerator.generateToken(input.hash);
  await saveToken(tokenRepository, otp.userId, token);
  return { token };
}

async function saveToken(
  tokenRepository: TokenRepository,
  userId: UserId,
  token: Token,
): Promise<void> {
  await tokenRepository.saveTokenToDb(userId, token);
}

function isOtpExpired(otp: Otp): boolean {
  return otp.expirationDate < new Date().toISOString();
}
