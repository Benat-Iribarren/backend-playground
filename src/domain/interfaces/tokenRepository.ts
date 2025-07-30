import { Hash } from '../model/hashType';
import { Token } from '../model/tokenType';

export interface TokenRepository {
  saveTokenToDb(hash: Hash, token: Token): Promise<void>;
}
