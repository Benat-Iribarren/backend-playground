import { Token, TokenStorage } from '../domain/model/tokenType';
import { HashCode } from '../domain/model/hashCode';
import { tokenRepository } from './database/operations/tokenOperations';

export const tokenStorage: TokenStorage = {
  async saveToken(hash: HashCode, token: Token) {
    await tokenRepository.saveTokenToDb(hash, token);
  },
};
