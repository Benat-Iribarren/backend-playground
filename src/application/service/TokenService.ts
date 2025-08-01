import { Token } from '../../domain/model/tokenType';
import { Hash } from '../../domain/model/hashType';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';
import { TokenService } from '../../domain/interfaces/tokenService';
import { tokenRepository } from '../../infrastructure/database/operations/tokenOperations';

export const TokenServiceImpl: TokenService = {
  async saveToken(token) {
    return tokenRepository.saveTokenToDb(token);
  },
  generateToken(hash: Hash): Token {
    return generateTokenGivenHash(hash);
  },
};
