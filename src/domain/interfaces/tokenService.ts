import { HashCode } from '../model/hashCode';
import { Token } from '../model/tokenType';

export interface TokenService {
  saveToken(hash: HashCode, token: Token): Promise<void>;
  generateToken(hash: HashCode): Token;

}
