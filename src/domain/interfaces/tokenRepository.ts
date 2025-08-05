import { Token } from '../model/token';

export interface TokenRepository {
  saveTokenToDb(token: Token): Promise<void>;
}
