import { tokenRepository } from '../../infrastructure/database/repository/tokenRepository';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';
import { Hash } from './otp';
export type Token = string;

export async function saveToken(token: Token): Promise<void> {
  return tokenRepository.saveTokenToDb(token);
}
export function generateToken(hash: Hash): Token {
  return generateTokenGivenHash(hash);
}
