import { Hash } from '../../model/Otp';
import { Token } from '../../model/Token';

export interface TokenGenerator {
  generateToken(hash: Hash): Token;
}
