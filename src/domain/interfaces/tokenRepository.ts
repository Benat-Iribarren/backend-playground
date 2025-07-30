import { Token } from '../model/tokenType';

export interface TokenRepository {
  saveTokenToDb(token: Token): Promise<void>;
}
