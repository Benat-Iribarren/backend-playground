import { isOtpExpired, Otp } from '../../domain/model/Otp';
import { TokenUser } from '../../../common/domain/model/TokenUser';
import { TokenRepository } from '../../domain/interfaces/repositories/TokenRepository';
import { UserId } from '@common/domain/model/UserParameters';
import { TokenGenerator } from '@common/domain/interfaces/generators/TokenGenerator';
import { OtpRepository } from '../../domain/interfaces/repositories/OtpRepository';
import {
  ExpiredVerificationCodeError,
  expiredVerificationCodeErrorStatusMsg,
  OtpNotFoundError,
  otpNotFoundErrorStatusMsg,
} from '../../domain/errors/otpLoginError';

type VerifyOtpInput = Pick<Otp, 'verificationCode' | 'hash'>;
type VerifyOtpResponse = { token: TokenUser };

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

  const token: TokenUser = tokenGenerator.generateToken(hash);
  await saveToken(tokenRepository, userId, token);
  return { token };
}

async function saveToken(
  tokenRepository: TokenRepository,
  userId: UserId,
  token: TokenUser,
): Promise<void> {
  await tokenRepository.saveToken(userId, token);
}

function otpDoesntExist(otp: Otp | null): otp is null {
  return otp === null;
}
