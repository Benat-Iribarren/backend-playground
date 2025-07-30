import { Token } from '../../domain/model/tokenType';
import { Hash } from '../../domain/model/hashType';
import { generateTokenGivenHash } from '../../infrastructure/helpers/tokenGenerator';
import { TokenService } from '../../domain/interfaces/tokenService';
import { tokenStorage } from '../../infrastructure/tokenStorage';

export const TokenServiceImpl: TokenService = {
  async saveToken(hash, token) {
    return tokenStorage.saveToken(hash, token);
  },
  generateToken(hash: Hash): Token {
    return generateTokenGivenHash(hash);
  },
};
