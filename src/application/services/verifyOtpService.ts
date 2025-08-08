import { Hash, Otp } from '../../domain/model/Otp';
import { Token } from '../../domain/model/Token';
import {
  IncorrectHashOrCodeError,
  incorrectHashOrCodeErrorStatusMsg,
} from '../../domain/errors/verifyOtpErrors';
import { TokenRepository } from '../../domain/interfaces/repositories/TokenRepository';
import { UserId } from '../../domain/model/User';
import { TokenGenerator } from '../../domain/interfaces/generators/TokenGenerator';
import { OtpValidator } from '../../domain/interfaces/validators/OtpValidator';
import { OtpRepository } from '../../domain/interfaces/repositories/OtpRepository';

type OtpWithoutExpiration = Omit<Otp, 'expirationDate'>;

export async function processOtpVerificationRequest(
  tokenRepository: TokenRepository,
  otpRepository: OtpRepository,
  tokenGenerator: TokenGenerator,
  otpValidator: OtpValidator,
  otpWithoutExpiration: OtpWithoutExpiration,
): Promise<IncorrectHashOrCodeError | { token: Token }> {
  if (await otpExpired(otpValidator, otpWithoutExpiration)) {
    return incorrectHashOrCodeErrorStatusMsg;
  }

  const userId: UserId | null = await otpRepository.getUserId(otpWithoutExpiration.hash);
  if (usesIdNotFound(userId)) {
    return incorrectHashOrCodeErrorStatusMsg;
  }
  return await getToken(tokenRepository, tokenGenerator, userId, otpWithoutExpiration);
}

const otpExpired = async (
  otpValidator: OtpValidator,
  otpWithoutExpiration: OtpWithoutExpiration,
) => {
  const otpValid = await otpValidator.isOtpValid(
    otpWithoutExpiration.hash,
    otpWithoutExpiration.verificationCode,
  );
  const otpExired = !otpValid;
  return otpExired;
};

function usesIdNotFound(userId: number | null) {
  return userId === null;
}

async function getToken(
  tokenRepository: TokenRepository,
  tokenGenerator: TokenGenerator,
  userId: UserId,
  otpWithoutExpiration: OtpWithoutExpiration,
): Promise<{ token: Token }> {
  const token: Token = generateToken(tokenGenerator, otpWithoutExpiration.hash);
  await saveToken(tokenRepository, userId, token);
  return { token };
}

function generateToken(tokenGenerator: TokenGenerator, hash: Hash): Token {
  return tokenGenerator.generateTokenGivenHash(hash);
}

async function saveToken(
  tokenRepository: TokenRepository,
  userId: UserId,
  token: Token,
): Promise<void> {
  tokenRepository.saveTokenToDb(userId, token);
}
