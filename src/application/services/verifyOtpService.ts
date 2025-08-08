import { Otp } from '../../domain/model/Otp';
import { Token } from '../../domain/model/Token';
import {
  IncorrectHashOrCodeError,
  incorrectHashOrCodeErrorStatusMsg,
} from '../../domain/errors/verifyOtpErrors';
import { TokenRepository } from '../../domain/interfaces/repositories/TokenRepository';
import { UserId } from '../../domain/model/User';
import { TokenGenerator } from '../../domain/interfaces/generators/TokenGenerator';
import { OtpRepository } from '../../domain/interfaces/repositories/OtpRepository';
import { OtpValidator } from '../../domain/interfaces/validators/OtpValidator';

type VerifyInput = Omit<Otp, 'expirationDate' | 'userId'>;

export async function processOtpVerificationRequest(
  tokenRepository: TokenRepository,
  otpRepository: OtpRepository,
  tokenGenerator: TokenGenerator,
  otpValidator: OtpValidator,
  input: VerifyInput,
): Promise<IncorrectHashOrCodeError | { token: Token }> {
  const otp: Otp | null = await otpRepository.getOtp(input.verificationCode, input.hash);
  if (!otp) {
    return incorrectHashOrCodeErrorStatusMsg;
  }

  const otpValid = await otpValidator.isOtpValid(input.hash, input.verificationCode);
  if (!otpValid) {
    return incorrectHashOrCodeErrorStatusMsg;
  }

  const token: Token = tokenGenerator.generateTokenGivenHash(input.hash);
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
