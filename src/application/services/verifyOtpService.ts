import { isOtpValid } from '../../infrastructure/helpers/otpValidator';
import { Hash, Otp } from '../../domain/model/Otp';
import { Token } from '../../domain/model/Token';
import {
  IncorrectHashOrCodeError,
  incorrectHashOrCodeErrorStatusMsg,
} from '../../domain/errors/verifyOtpErrors';
import { TokenRepository } from '../../domain/interfaces/repositories/tokenRepository';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';
import { UserId } from '../../domain/model/User';
import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';

type OtpWithoutExpirationDate = Omit<Otp, 'expirationDate'>;

export async function processOtpVerificationRequest(
  tokenRepository: TokenRepository,
  otpRepository: OtpRepository,
  otpWithoutExpiration: OtpWithoutExpirationDate,
): Promise<IncorrectHashOrCodeError | { token: Token }> {
  const otp: Otp = await otpRepository.getOtp(
    otpWithoutExpiration.verificationCode,
    otpWithoutExpiration.hash,
  );

  if (await otpExpired(otp.expirationDate)) {
    return incorrectHashOrCodeErrorStatusMsg;
  }

  if (usesIdNotFound(userId)) {
    return incorrectHashOrCodeErrorStatusMsg;
  }
  return await getToken(tokenRepository, userId, otpWithoutExpiration);
}

const otpExpired = async (otpWithoutExpiration: OtpWithoutExpirationDate) => {
  const otpValid = await isOtpValid({ ...otpWithoutExpiration });
  const otpExired = !otpValid;
  return otpExired;
};

function usesIdNotFound(userId: UserId | null) {
  return userId === null;
}

async function getToken(
  tokenRepository: TokenRepository,
  userId: UserId,
  otpWithoutExpiration: OtpWithoutExpirationDate,
): Promise<{ token: Token }> {
  const token: Token = generateToken(otpWithoutExpiration.hash);
  await saveToken(tokenRepository, userId, token);
  return { token };
}

function generateToken(hash: Hash): Token {
  return generateTokenGivenHash(hash);
}

async function saveToken(
  tokenRepository: TokenRepository,
  userId: UserId,
  token: Token,
): Promise<void> {
  tokenRepository.saveTokenToDb(userId, token);
}
