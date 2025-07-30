import { Token } from '../domain/model/tokenType';
import { tokenRepository } from './database/operations/tokenOperations';
import { TokenStorage } from '../domain/interfaces/tokenStorage';

export const tokenStorage: TokenStorage = {
  async saveToken(token: Token) {
    await tokenRepository.saveTokenToDb(token);
  },
};
