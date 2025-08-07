import { Hash } from '../../domain/model/otp';
import { Token } from '../../domain/model/token';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';

export function generateToken(hash: Hash): Token {
  return generateTokenGivenHash(hash);
}
