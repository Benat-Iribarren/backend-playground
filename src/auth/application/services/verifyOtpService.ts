import { isOtpExpired, Otp } from '../../domain/model/Otp';
import { Token } from '../../domain/model/Token';
import { TokenRepository } from '../../domain/interfaces/repositories/TokenRepository';
import { UserId } from '../../domain/model/User';
import { TokenGenerator } from '../../domain/interfaces/generators/TokenGenerator';
import { OtpRepository } from '../../domain/interfaces/repositories/OtpRepository';
import {
  ExpiredVerificationCodeError,
  expiredVerificationCodeErrorStatusMsg,
  OtpNotFoundError,
  otpNotFoundErrorStatusMsg,
} from '../../domain/errors/otpLoginError';

type VerifyInput = Pick<Otp, 'verificationCode' | 'hash'>;
export type VerifyOtpServiceErrors = OtpNotFoundError | ExpiredVerificationCodeError;

export async function processOtpVerificationRequest(
  tokenRepository: TokenRepository,
  otpRepository: OtpRepository,
  tokenGenerator: TokenGenerator,
  input: VerifyInput,
): Promise<VerifyOtpServiceErrors | { token: Token }> {
  const otp: Otp | null = await otpRepository.getOtp(input.verificationCode, input.hash);

  if (!otp) {
    return otpNotFoundErrorStatusMsg;
  }

  otpRepository.deleteOtp(otp.userId);

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
  await tokenRepository.saveToken(userId, token);
}
