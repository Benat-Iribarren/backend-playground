import { Token, TokenStorage } from '../domain/model/tokenType';
import { Hash } from '../domain/model/hashType';
import { tokenRepository } from './database/operations/tokenOperations';

export const tokenStorage: TokenStorage = {
  async saveToken(hash: Hash, token: Token) {
    await tokenRepository.saveTokenToDb(hash, token);
  },
};
