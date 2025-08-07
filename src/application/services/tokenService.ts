import { OtpRepository } from '../../domain/interfaces/repositories/otpRepository';
import { Otp } from '../../domain/model/otp';
import { useOtpCode } from './otpService';
import { Hash } from '../../domain/model/otp';
import { Token } from '../../domain/model/token';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';
import { TokenRepository } from '../../domain/interfaces/repositories/tokenRepository';

export async function getToken(
  otpRepository: OtpRepository,
  tokenRepository: TokenRepository,
  otp: Otp,
): Promise<{ token: Token }> {
  useOtpCode(otpRepository, otp);
  const token: Token = generateToken(otp.hash);
  await saveToken(tokenRepository, token);
  return { token };
}
function generateToken(hash: Hash): Token {
  return generateTokenGivenHash(hash);
}

async function saveToken(tokenRepository: TokenRepository, token: Token): Promise<void> {
  tokenRepository.saveTokenToDb(token);
}
