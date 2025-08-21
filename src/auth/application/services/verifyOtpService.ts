import { isOtpExpired, Otp } from '../../domain/model/Otp';
import { Token } from '../../domain/model/Token';
import { TokenRepository } from '../../domain/interfaces/repositories/TokenRepository';
import { UserId } from '@common/domain/model/User';
import { TokenGenerator } from '../../domain/interfaces/generators/TokenGenerator';
import { OtpRepository } from '../../domain/interfaces/repositories/OtpRepository';
import {
  ExpiredVerificationCodeError,
  expiredVerificationCodeErrorStatusMsg,
  OtpNotFoundError,
  otpNotFoundErrorStatusMsg,
} from '../../domain/errors/otpLoginError';

type VerifyOtpInput = Pick<Otp, 'verificationCode' | 'hash'>;
type VerifyOtpResponse = { token: Token };

export type VerifyOtpServiceErrors = OtpNotFoundError | ExpiredVerificationCodeError;

export async function processOtpVerificationRequest(
  tokenRepository: TokenRepository,
  otpRepository: OtpRepository,
  tokenGenerator: TokenGenerator,
  input: VerifyOtpInput,
): Promise<VerifyOtpServiceErrors | VerifyOtpResponse> {
  const { verificationCode, hash } = input;
  const otp: Otp | null = await otpRepository.getOtp(verificationCode, hash);

  if (otpDoesntExist(otp)) {
    return otpNotFoundErrorStatusMsg;
  }

  const { userId } = otp;
  otpRepository.deleteOtp(userId);

  if (isOtpExpired(otp)) {
    return expiredVerificationCodeErrorStatusMsg;
  }

  const token: Token = tokenGenerator.generateToken(hash);
  await saveToken(tokenRepository, userId, token);
  return { token };
}

async function saveToken(
  tokenRepository: TokenRepository,
  userId: UserId,
  token: Token,
): Promise<void> {
  await tokenRepository.saveToken(userId, token);
}

function otpDoesntExist(otp: Otp | null): otp is null {
  return otp === null;
}
