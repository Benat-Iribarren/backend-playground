import { Token } from '../model/tokenType';

export interface TokenStorage {
  saveToken(token: Token): Promise<void>;
}
