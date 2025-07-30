import { Hash } from '../model/hashType';
import { Token } from '../model/tokenType';

export interface TokenService {
  saveToken(token: Token): Promise<void>;
  generateToken(hash: Hash): Token;
}
