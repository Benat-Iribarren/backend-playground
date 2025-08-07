import { isOtpValid } from '../../infrastructure/helpers/otpValidator';
import { Hash, Otp, VerificationCode } from '../../domain/model/otp';
import { Token } from '../../domain/model/token';
import {
  IncorrectHashOrCodeError,
  incorrectHashOrCodeErrorStatusMsg,
} from '../../domain/errors/verifyOtpErrors';
import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { TokenRepository } from '../../domain/interfaces/repositories/tokenRepository';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';
import { UserId } from '../../domain/model/user';

export async function processOtpVerificationRequest(
  otpRepository: OtpRepository,
  tokenRepository: TokenRepository,
  userId: UserId,
  otp: Otp,
): Promise<IncorrectHashOrCodeError | { token: Token }> {
  if (await otpExpired(otp)) {
    useOtpCode(otpRepository, otp);
    return incorrectHashOrCodeErrorStatusMsg;
  }

  return await getToken(otpRepository, tokenRepository, userId, otp);
}

const otpExpired = async (otp: Otp) => {
  const otpValid = await isOtpValid(otp);
  const otpExired = !otpValid;
  return otpExired;
};

export async function getToken(
  otpRepository: OtpRepository,
  tokenRepository: TokenRepository,
  userId: UserId,
  otp: Otp,
): Promise<{ token: Token }> {
  useOtpCode(otpRepository, otp);
  const token: Token = generateToken(otp.hash);
  await saveToken(tokenRepository, userId, token);
  return { token };
}
function generateToken(hash: Hash): Token {
  return generateTokenGivenHash(hash);
}

async function saveToken(tokenRepository: TokenRepository, userId: UserId, token: Token): Promise<void> {
  tokenRepository.saveTokenToDb(userId, token);
}

export const useOtpCode = async (otpRepository: OtpRepository, otp: Otp) => {
  await otpRepository.deleteOtpFromHashCode(otp.hash);
};
