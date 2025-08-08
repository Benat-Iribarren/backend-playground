import { Hash } from '../../model/Otp';
import { Token } from '../../model/Token';

export interface TokenGenerator {
  generateTokenGivenHash(hash: Hash): Token;
}
